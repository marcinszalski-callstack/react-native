/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "RCTBackdropFilterUtils.h"

#import <CoreImage/CoreImage.h>
#import <React/RCTConversions.h>
#import <react/renderer/graphics/Filter.h>

using namespace facebook::react;

@implementation RCTBackdropFilterUtils

+ (nullable NSArray<CIFilter *> *)backgroundFiltersFromFilterFunctions:
    (const std::vector<FilterFunction> &)filterFunctions
{
  if (filterFunctions.empty()) {
    return nil;
  }

  NSMutableArray<CIFilter *> *filters = [NSMutableArray array];

  for (const auto &primitive : filterFunctions) {
    CIFilter *ciFilter = [self _ciFilterFromFilterFunction:primitive];
    if (ciFilter != nil) {
      [filters addObject:ciFilter];
    }
  }

  return filters.count > 0 ? [filters copy] : nil;
}

+ (void)applyDropShadow:(const FilterFunction &)filterFunction toLayer:(CALayer *)layer
{
  if (filterFunction.type != FilterType::DropShadow) {
    return;
  }
  if (!std::holds_alternative<DropShadowParams>(filterFunction.parameters)) {
    return;
  }

  const auto &params = std::get<DropShadowParams>(filterFunction.parameters);

  UIColor *shadowColor = params.color ? RCTUIColorFromSharedColor(params.color) : UIColor.blackColor;
  layer.shadowColor = shadowColor.CGColor;
  layer.shadowOffset = CGSizeMake(params.offsetX, params.offsetY);
  layer.shadowRadius = params.standardDeviation;
  layer.shadowOpacity = 1.0f;
}

+ (void)clearBackdropFilterFromLayer:(CALayer *)layer
{
  layer.backgroundFilters = nil;
  layer.shadowColor = UIColor.clearColor.CGColor;
  layer.shadowOpacity = 0.0f;
  layer.shadowRadius = 0.0f;
  layer.shadowOffset = CGSizeZero;
}

// MARK: - Private

+ (nullable CIFilter *)_ciFilterFromFilterFunction:(const FilterFunction &)primitive
{
  if (!std::holds_alternative<Float>(primitive.parameters)) {
    // drop-shadow has DropShadowParams — handled separately via applyDropShadow:toLayer:
    return nil;
  }

  const Float value = std::get<Float>(primitive.parameters);

  switch (primitive.type) {
    case FilterType::Blur: {
      CIFilter *filter = [CIFilter filterWithName:@"CIGaussianBlur"];
      [filter setValue:@(value) forKey:@"inputRadius"];
      return filter;
    }

    case FilterType::Brightness: {
      // CSS brightness(n) is multiplicative: 0=black, 1=normal, 2=double.
      // CIColorMatrix scales each RGB channel independently.
      CIFilter *filter = [CIFilter filterWithName:@"CIColorMatrix"];
      CIVector *scale = [CIVector vectorWithX:value Y:0 Z:0 W:0];
      [filter setValue:scale forKey:@"inputRVector"];
      [filter setValue:[CIVector vectorWithX:0 Y:value Z:0 W:0] forKey:@"inputGVector"];
      [filter setValue:[CIVector vectorWithX:0 Y:0 Z:value W:0] forKey:@"inputBVector"];
      [filter setValue:[CIVector vectorWithX:0 Y:0 Z:0 W:1] forKey:@"inputAVector"];
      [filter setValue:[CIVector vectorWithX:0 Y:0 Z:0 W:0] forKey:@"inputBiasVector"];
      return filter;
    }

    case FilterType::Contrast: {
      // CIColorControls.inputContrast: 0=gray, 1=normal, >1=more contrast.
      // Matches CSS contrast() semantics directly.
      CIFilter *filter = [CIFilter filterWithName:@"CIColorControls"];
      [filter setValue:@(value) forKey:@"inputContrast"];
      [filter setValue:@(0.0f) forKey:@"inputBrightness"];
      [filter setValue:@(1.0f) forKey:@"inputSaturation"];
      return filter;
    }

    case FilterType::Grayscale: {
      // CSS grayscale(0)=color, grayscale(1)=gray.
      // Map to CIColorControls: saturation = 1 - grayscaleAmount.
      CIFilter *filter = [CIFilter filterWithName:@"CIColorControls"];
      [filter setValue:@(1.0f - value) forKey:@"inputSaturation"];
      [filter setValue:@(0.0f) forKey:@"inputBrightness"];
      [filter setValue:@(1.0f) forKey:@"inputContrast"];
      return filter;
    }

    case FilterType::Saturate: {
      // CIColorControls.inputSaturation: 0=gray, 1=normal, >1=vibrant.
      // Matches CSS saturate() semantics directly.
      CIFilter *filter = [CIFilter filterWithName:@"CIColorControls"];
      [filter setValue:@(value) forKey:@"inputSaturation"];
      [filter setValue:@(0.0f) forKey:@"inputBrightness"];
      [filter setValue:@(1.0f) forKey:@"inputContrast"];
      return filter;
    }

    case FilterType::HueRotate: {
      // CIHueAdjust.inputAngle takes radians; CSS value arrives in degrees.
      CIFilter *filter = [CIFilter filterWithName:@"CIHueAdjust"];
      [filter setValue:@(value * M_PI / 180.0) forKey:@"inputAngle"];
      return filter;
    }

    case FilterType::Invert: {
      // CSS invert(n): R_out = n*(1 - R_in) + (1-n)*R_in = R_in*(1-2n) + n
      // CIColorMatrix: vector * R + bias
      const Float s = 1.0f - 2.0f * value;
      CIFilter *filter = [CIFilter filterWithName:@"CIColorMatrix"];
      [filter setValue:[CIVector vectorWithX:s Y:0 Z:0 W:0] forKey:@"inputRVector"];
      [filter setValue:[CIVector vectorWithX:0 Y:s Z:0 W:0] forKey:@"inputGVector"];
      [filter setValue:[CIVector vectorWithX:0 Y:0 Z:s W:0] forKey:@"inputBVector"];
      [filter setValue:[CIVector vectorWithX:0 Y:0 Z:0 W:1] forKey:@"inputAVector"];
      [filter setValue:[CIVector vectorWithX:value Y:value Z:value W:0]
                forKey:@"inputBiasVector"];
      return filter;
    }

    case FilterType::Opacity: {
      // CSS opacity(n): A_out = n * A_in.
      CIFilter *filter = [CIFilter filterWithName:@"CIColorMatrix"];
      [filter setValue:[CIVector vectorWithX:1 Y:0 Z:0 W:0] forKey:@"inputRVector"];
      [filter setValue:[CIVector vectorWithX:0 Y:1 Z:0 W:0] forKey:@"inputGVector"];
      [filter setValue:[CIVector vectorWithX:0 Y:0 Z:1 W:0] forKey:@"inputBVector"];
      [filter setValue:[CIVector vectorWithX:0 Y:0 Z:0 W:value] forKey:@"inputAVector"];
      [filter setValue:[CIVector vectorWithX:0 Y:0 Z:0 W:0] forKey:@"inputBiasVector"];
      return filter;
    }

    case FilterType::Sepia: {
      // CISepiaTone.inputIntensity: 0=no effect, 1=full sepia. Matches CSS sepia().
      CIFilter *filter = [CIFilter filterWithName:@"CISepiaTone"];
      [filter setValue:@(value) forKey:@"inputIntensity"];
      return filter;
    }

    case FilterType::DropShadow:
      // Handled separately via applyDropShadow:toLayer: — cannot be expressed
      // as a backgroundFilters CIFilter.
      return nil;
  }
}

@end
