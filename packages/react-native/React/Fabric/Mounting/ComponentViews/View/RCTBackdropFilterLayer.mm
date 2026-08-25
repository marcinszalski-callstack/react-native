/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "RCTBackdropFilterLayer.h"

#import <React/RCTBackdropFilterUtils.h>
#import <UIKit/UIKit.h>

@implementation RCTBackdropFilterLayer

- (void)display
{
  UIView *host = self.hostView;
  if (!host || !host.superview) {
    self.contents = nil;
    return;
  }

  UIView *backdrop = host.superview;
  CGSize captureSize = self.bounds.size;
  if (captureSize.width <= 0 || captureSize.height <= 0) {
    return;
  }

  CGFloat scale = UIScreen.mainScreen.scale;
  // host.frame is in the backdrop view's coordinate system.
  CGRect hostFrameInBackdrop = host.frame;

  // Temporarily hide the host view so its own content is excluded from the
  // backdrop capture. afterScreenUpdates:NO reads the already-committed
  // compositor output, so hiding here is sufficient.
  host.hidden = YES;

  UIGraphicsBeginImageContextWithOptions(captureSize, NO, scale);
  CGContextRef ctx = UIGraphicsGetCurrentContext();
  // Translate so the area of the backdrop that sits behind the host view
  // maps to origin (0, 0) in the capture context.
  CGContextTranslateCTM(ctx, -hostFrameInBackdrop.origin.x, -hostFrameInBackdrop.origin.y);
  [backdrop drawHierarchy:backdrop.bounds afterScreenUpdates:NO];
  UIImage *snapshot = UIGraphicsGetImageFromCurrentImageContext();
  UIGraphicsEndImageContext();

  host.hidden = NO;

  if (!snapshot) {
    self.contents = nil;
    return;
  }

  CIImage *ciImage = [CIImage imageWithCGImage:snapshot.CGImage];
  CIImage *filtered = [RCTBackdropFilterUtils applyCIFilterFunctions:_filterFunctions toImage:ciImage];

  static CIContext *ciContext;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    ciContext = [CIContext context];
  });

  CGImageRef cgImage = [ciContext createCGImage:filtered fromRect:filtered.extent];
  if (cgImage) {
    self.contents = (__bridge id)cgImage;
    CGImageRelease(cgImage);
  } else {
    self.contents = nil;
  }
}

@end
