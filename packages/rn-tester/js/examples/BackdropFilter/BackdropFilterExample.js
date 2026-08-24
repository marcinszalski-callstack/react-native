/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

'use strict';

import type {RNTesterModuleExample} from '../../types/RNTesterTypes';
import type {ViewStyleProp} from 'react-native/Libraries/StyleSheet/StyleSheet';

import * as React from 'react';
import {StyleSheet, Text, View} from 'react-native';

/**
 * Renders a colorful four-quadrant background with centred text, then places
 * a semi-transparent overlay on top. The backdropFilter style is applied to
 * the overlay so the effect acts on the background content behind it.
 */
function BackdropScene({
  overlayStyle,
  testID,
}: {
  overlayStyle: ViewStyleProp,
  testID?: string,
}): React.Node {
  return (
    <View style={styles.scene} testID={testID}>
      <View style={styles.bgRed} />
      <View style={styles.bgBlue} />
      <View style={styles.bgGreen} />
      <View style={styles.bgYellow} />
      <Text style={styles.bgText}>Hello world!</Text>
      <View style={[styles.overlay, overlayStyle]} />
    </View>
  );
}

function Comparison({
  overlayStyle,
  testID,
}: {
  overlayStyle: ViewStyleProp,
  testID?: string,
}): React.Node {
  return (
    <View style={styles.row}>
      <View style={styles.column}>
        <Text style={styles.label}>Original</Text>
        <BackdropScene overlayStyle={{}} />
      </View>
      <View style={styles.column}>
        <Text style={styles.label}>Filtered</Text>
        <BackdropScene overlayStyle={overlayStyle} testID={testID} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scene: {
    width: 150,
    height: 150,
    overflow: 'hidden',
  },
  bgRed: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 75,
    height: 75,
    backgroundColor: '#e74c3c',
  },
  bgBlue: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 75,
    height: 75,
    backgroundColor: '#2980b9',
  },
  bgGreen: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 75,
    height: 75,
    backgroundColor: '#27ae60',
  },
  bgYellow: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 75,
    height: 75,
    backgroundColor: '#f39c12',
  },
  bgText: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'white',
    fontSize: 16,
  },
  overlay: {
    position: 'absolute',
    top: 25,
    left: 25,
    width: 100,
    height: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  column: {
    alignItems: 'center',
    gap: 4,
  },
  label: {
    fontSize: 12,
    color: '#666',
  },
});

exports.title = 'Backdrop Filter';
exports.category = 'UI';
exports.description =
  'Graphical effects applied to the area behind an element. The element or its background must be transparent or semi-transparent for the effect to be visible.';
exports.examples = [
  // ─── blur ──────────────────────────────────────────────────────────────────
  {
    title: 'Blur (array form)',
    description: 'backdropFilter: [{blur: 10}]',
    name: 'blur-array',
    render(): React.Node {
      return (
        <Comparison
          overlayStyle={{backdropFilter: [{blur: 10}]}}
          testID="backdrop-filter-test-blur"
        />
      );
    },
  },
  {
    title: 'Blur (string form)',
    description: "backdropFilter: 'blur(10px)'",
    name: 'blur-string',
    render(): React.Node {
      return (
        <Comparison
          overlayStyle={{backdropFilter: 'blur(10px)'}}
          testID="backdrop-filter-test-blur-string"
        />
      );
    },
  },

  // ─── brightness ────────────────────────────────────────────────────────────
  {
    title: 'Brightness — brighter (number)',
    description: 'backdropFilter: [{brightness: 1.5}]',
    name: 'brightness-up',
    render(): React.Node {
      return (
        <Comparison
          overlayStyle={{backdropFilter: [{brightness: 1.5}]}}
          testID="backdrop-filter-test-brightness-up"
        />
      );
    },
  },
  {
    title: 'Brightness — darker (percentage string)',
    description: "backdropFilter: 'brightness(30%)'",
    name: 'brightness-down',
    render(): React.Node {
      return (
        <Comparison
          overlayStyle={{backdropFilter: 'brightness(30%)'}}
          testID="backdrop-filter-test-brightness-down"
        />
      );
    },
  },

  // ─── contrast ──────────────────────────────────────────────────────────────
  {
    title: 'Contrast (number)',
    description: 'backdropFilter: [{contrast: 2}]',
    name: 'contrast-array',
    render(): React.Node {
      return (
        <Comparison
          overlayStyle={{backdropFilter: [{contrast: 2}]}}
          testID="backdrop-filter-test-contrast"
        />
      );
    },
  },
  {
    title: 'Contrast (percentage string)',
    description: "backdropFilter: 'contrast(40%)'",
    name: 'contrast-string',
    render(): React.Node {
      return (
        <Comparison
          overlayStyle={{backdropFilter: 'contrast(40%)'}}
          testID="backdrop-filter-test-contrast-string"
        />
      );
    },
  },

  // ─── grayscale ─────────────────────────────────────────────────────────────
  {
    title: 'Grayscale (full)',
    description: 'backdropFilter: [{grayscale: 1}]',
    name: 'grayscale-full',
    render(): React.Node {
      return (
        <Comparison
          overlayStyle={{backdropFilter: [{grayscale: 1}]}}
          testID="backdrop-filter-test-grayscale"
        />
      );
    },
  },
  {
    title: 'Grayscale (percentage string)',
    description: "backdropFilter: 'grayscale(30%)'",
    name: 'grayscale-string',
    render(): React.Node {
      return (
        <Comparison
          overlayStyle={{backdropFilter: 'grayscale(30%)'}}
          testID="backdrop-filter-test-grayscale-string"
        />
      );
    },
  },

  // ─── sepia ─────────────────────────────────────────────────────────────────
  {
    title: 'Sepia (number)',
    description: 'backdropFilter: [{sepia: 0.9}]',
    name: 'sepia-array',
    render(): React.Node {
      return (
        <Comparison
          overlayStyle={{backdropFilter: [{sepia: 0.9}]}}
          testID="backdrop-filter-test-sepia"
        />
      );
    },
  },
  {
    title: 'Sepia (percentage string)',
    description: "backdropFilter: 'sepia(90%)'",
    name: 'sepia-string',
    render(): React.Node {
      return (
        <Comparison
          overlayStyle={{backdropFilter: 'sepia(90%)'}}
          testID="backdrop-filter-test-sepia-string"
        />
      );
    },
  },

  // ─── saturate ──────────────────────────────────────────────────────────────
  {
    title: 'Saturate (over-saturated)',
    description: 'backdropFilter: [{saturate: 4}]',
    name: 'saturate-array',
    render(): React.Node {
      return (
        <Comparison
          overlayStyle={{backdropFilter: [{saturate: 4}]}}
          testID="backdrop-filter-test-saturate"
        />
      );
    },
  },
  {
    title: 'Saturate (percentage string)',
    description: "backdropFilter: 'saturate(80%)'",
    name: 'saturate-string',
    render(): React.Node {
      return (
        <Comparison
          overlayStyle={{backdropFilter: 'saturate(80%)'}}
          testID="backdrop-filter-test-saturate-string"
        />
      );
    },
  },

  // ─── invert ────────────────────────────────────────────────────────────────
  {
    title: 'Invert (full)',
    description: 'backdropFilter: [{invert: 1}]',
    name: 'invert-full',
    render(): React.Node {
      return (
        <Comparison
          overlayStyle={{backdropFilter: [{invert: 1}]}}
          testID="backdrop-filter-test-invert"
        />
      );
    },
  },
  {
    title: 'Invert (percentage string)',
    description: "backdropFilter: 'invert(70%)'",
    name: 'invert-string',
    render(): React.Node {
      return (
        <Comparison
          overlayStyle={{backdropFilter: 'invert(70%)'}}
          testID="backdrop-filter-test-invert-string"
        />
      );
    },
  },

  // ─── opacity ───────────────────────────────────────────────────────────────
  {
    title: 'Opacity (number)',
    description: 'backdropFilter: [{opacity: 0.3}]',
    name: 'opacity-array',
    render(): React.Node {
      return (
        <Comparison
          overlayStyle={{backdropFilter: [{opacity: 0.3}]}}
          testID="backdrop-filter-test-opacity"
        />
      );
    },
  },
  {
    title: 'Opacity (percentage string)',
    description: "backdropFilter: 'opacity(20%)'",
    name: 'opacity-string',
    render(): React.Node {
      return (
        <Comparison
          overlayStyle={{backdropFilter: 'opacity(20%)'}}
          testID="backdrop-filter-test-opacity-string"
        />
      );
    },
  },

  // ─── hue-rotate ────────────────────────────────────────────────────────────
  {
    title: 'Hue Rotate (deg string)',
    description: "backdropFilter: [{hueRotate: '120deg'}]",
    name: 'hue-rotate-deg',
    render(): React.Node {
      return (
        <Comparison
          overlayStyle={{backdropFilter: [{hueRotate: '120deg'}]}}
          testID="backdrop-filter-test-hue-rotate"
        />
      );
    },
  },
  {
    title: 'Hue Rotate (rad string)',
    description: "backdropFilter: [{hueRotate: '2.094rad'}]  (≈120deg)",
    name: 'hue-rotate-rad',
    render(): React.Node {
      return (
        <Comparison
          overlayStyle={{backdropFilter: [{hueRotate: '2.094rad'}]}}
          testID="backdrop-filter-test-hue-rotate-rad"
        />
      );
    },
  },
  {
    title: 'Hue Rotate (CSS string form)',
    description: "backdropFilter: 'hue-rotate(120deg)'",
    name: 'hue-rotate-string',
    render(): React.Node {
      return (
        <Comparison
          overlayStyle={{backdropFilter: 'hue-rotate(120deg)'}}
          testID="backdrop-filter-test-hue-rotate-string"
        />
      );
    },
  },

  // ─── drop-shadow ───────────────────────────────────────────────────────────
  {
    title: 'Drop Shadow (object form)',
    description:
      'backdropFilter: [{dropShadow: {offsetX: 4, offsetY: 4, standardDeviation: 6, color: "rgba(0,0,0,0.8)"}}]',
    name: 'drop-shadow-object',
    render(): React.Node {
      return (
        <Comparison
          overlayStyle={{
            backdropFilter: [
              {
                dropShadow: {
                  offsetX: 4,
                  offsetY: 4,
                  standardDeviation: 6,
                  color: 'rgba(0,0,0,0.8)',
                },
              },
            ],
          }}
          testID="backdrop-filter-test-drop-shadow-object"
        />
      );
    },
  },
  {
    title: 'Drop Shadow (2-length string form)',
    description: "backdropFilter: 'drop-shadow(4px 4px)'",
    name: 'drop-shadow-2-length',
    render(): React.Node {
      return (
        <Comparison
          overlayStyle={{backdropFilter: 'drop-shadow(4px 4px)'}}
          testID="backdrop-filter-test-drop-shadow-2-length"
        />
      );
    },
  },
  {
    title: 'Drop Shadow (3-length string form)',
    description: "backdropFilter: 'drop-shadow(4px 4px 8px)'",
    name: 'drop-shadow-3-length',
    render(): React.Node {
      return (
        <Comparison
          overlayStyle={{backdropFilter: 'drop-shadow(4px 4px 8px)'}}
          testID="backdrop-filter-test-drop-shadow-3-length"
        />
      );
    },
  },
  {
    title: 'Drop Shadow (lengths + color)',
    description: "backdropFilter: 'drop-shadow(4px 4px 10px blue)'",
    name: 'drop-shadow-color',
    render(): React.Node {
      return (
        <Comparison
          overlayStyle={{backdropFilter: 'drop-shadow(4px 4px 10px blue)'}}
          testID="backdrop-filter-test-drop-shadow-color"
        />
      );
    },
  },
  {
    title: 'Drop Shadow (color first)',
    description: "backdropFilter: 'drop-shadow(#ee2233 4px 4px 10px)'",
    name: 'drop-shadow-color-first',
    render(): React.Node {
      return (
        <Comparison
          overlayStyle={{backdropFilter: 'drop-shadow(#ee2233 4px 4px 10px)'}}
          testID="backdrop-filter-test-drop-shadow-color-first"
        />
      );
    },
  },

  // ─── chained filters ───────────────────────────────────────────────────────
  {
    title: 'Chained (array form)',
    description:
      'backdropFilter: [{blur: 6}, {brightness: 1.2}, {saturate: 1.8}]',
    name: 'chained-array',
    render(): React.Node {
      return (
        <Comparison
          overlayStyle={{
            backdropFilter: [{blur: 6}, {brightness: 1.2}, {saturate: 1.8}],
          }}
          testID="backdrop-filter-test-chained"
        />
      );
    },
  },
  {
    title: 'Chained (string form)',
    description: "backdropFilter: 'blur(4px) saturate(150%)'",
    name: 'chained-string',
    render(): React.Node {
      return (
        <Comparison
          overlayStyle={{backdropFilter: 'blur(4px) saturate(150%)'}}
          testID="backdrop-filter-test-chained-string"
        />
      );
    },
  },
  {
    title: 'Chained (mixed: blur + hue-rotate + invert)',
    description: "backdropFilter: 'blur(3px) hue-rotate(90deg) invert(20%)'",
    name: 'chained-mixed',
    render(): React.Node {
      return (
        <Comparison
          overlayStyle={{
            backdropFilter: 'blur(3px) hue-rotate(90deg) invert(20%)',
          }}
          testID="backdrop-filter-test-chained-mixed"
        />
      );
    },
  },
] as Array<RNTesterModuleExample>;
