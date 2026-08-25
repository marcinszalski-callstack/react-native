/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#pragma once

#include <react/renderer/graphics/Filter.h>

#import <QuartzCore/QuartzCore.h>
#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

/**
 * A CALayer that implements CSS backdrop-filter on iOS.
 *
 * CALayer.backgroundFilters is not supported on iOS (it is macOS-only despite
 * the property existing on the class). This layer works around that limitation
 * by capturing the composited content behind its host view via
 * UIView.drawHierarchy:afterScreenUpdates:NO, applying a CIFilter chain to
 * the snapshot, and setting the result as its contents.
 *
 * Insert as the first sublayer of the host view's layer so it renders behind
 * all of the view's own content. Call setNeedsDisplay whenever the backdrop
 * or filter functions change.
 */
@interface RCTBackdropFilterLayer : CALayer

@property (nonatomic) std::vector<facebook::react::FilterFunction> filterFunctions;

/**
 * The UIView whose superview provides the backdrop source.
 * Must be set before the layer renders.
 */
@property (nonatomic, weak, nullable) UIView *hostView;

@end

NS_ASSUME_NONNULL_END
