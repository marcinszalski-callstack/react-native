/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#pragma once

#include <react/renderer/graphics/Filter.h>

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

/**
 * Converts a list of FilterFunction values into an array of CIFilter objects
 * suitable for use with CALayer.backgroundFilters.
 *
 * Returns nil if the filter list is empty.
 * Drop-shadow is excluded from the returned array and must be handled
 * separately via CALayer shadow properties.
 */
@interface RCTBackdropFilterUtils : NSObject

+ (nullable NSArray<CIFilter *> *)backgroundFiltersFromFilterFunctions:
    (const std::vector<facebook::react::FilterFunction> &)filterFunctions;

/**
 * Applies CALayer shadow properties for a drop-shadow FilterFunction.
 * Call this separately from backgroundFilters — CALayer cannot express
 * drop-shadow via CIFilter in the backgroundFilters array.
 */
+ (void)applyDropShadow:(const facebook::react::FilterFunction &)filterFunction
                toLayer:(CALayer *)layer;

/**
 * Clears all backdrop-filter effects previously applied to a layer.
 */
+ (void)clearBackdropFilterFromLayer:(CALayer *)layer;

@end

NS_ASSUME_NONNULL_END
