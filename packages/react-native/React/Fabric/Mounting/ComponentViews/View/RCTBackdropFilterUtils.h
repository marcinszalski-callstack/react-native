/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#pragma once

#include <react/renderer/graphics/Filter.h>

#import <CoreImage/CoreImage.h>
#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

/**
 * Utilities for rendering CSS backdrop-filter effects on iOS.
 *
 * CALayer.backgroundFilters is not supported on iOS. The actual rendering is
 * done by RCTBackdropFilterLayer, which captures the backdrop via
 * UIView.drawHierarchy:afterScreenUpdates:NO and calls applyCIFilterFunctions:toImage:
 * to apply the effect chain.
 */
@interface RCTBackdropFilterUtils : NSObject

/**
 * Applies filterFunctions as a chained CIFilter pipeline to image and returns
 * the result. Drop-shadow entries are skipped (they are applied separately via
 * CALayer shadow properties). Returns the original image if no filters apply.
 */
+ (CIImage *)applyCIFilterFunctions:
    (const std::vector<facebook::react::FilterFunction> &)filterFunctions
                            toImage:(CIImage *)image;

/**
 * Applies CALayer shadow properties for a drop-shadow FilterFunction.
 */
+ (void)applyDropShadow:(const facebook::react::FilterFunction &)filterFunction
                toLayer:(CALayer *)layer;

/**
 * Removes any RCTBackdropFilterLayer sublayer from layer and clears any
 * shadow properties applied by applyDropShadow:toLayer:.
 */
+ (void)clearBackdropFilterFromLayer:(CALayer *)layer;

@end

NS_ASSUME_NONNULL_END
