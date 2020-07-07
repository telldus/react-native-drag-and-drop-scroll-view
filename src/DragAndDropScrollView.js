/**
 * Copyright 2016-present Telldus Technologies AB.
 *
 * This file is part of the Telldus Live! app.
 *
 * Telldus Live! app is free : you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Telldus Live! app is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Telldus Live! app.  If not, see <http://www.gnu.org/licenses/>.
 */

// @flow

'use strict';

import React, {
	memo,
	useMemo,
	useCallback,
	useRef,
	useState,
	useEffect,
} from 'react';
import {
	Platform,
	View,
	PanResponder,
	Animated,
} from 'react-native';

import Row from './Row';

type ScrollDistanceFactor = {
	ios: number,
	android: number,
};

export interface Props {
	data: Array<any>,
	renderItem: () => Object,
	extraData?: Object,
	onSortOrderUpdate: (Array<any>) => void,
	onScroll?: (Object) => void,
	scrollEventThrottle?: number,
	scrollDistanceFactor?: ScrollDistanceFactor,
	startScrollThresholdFactor?: number,
} // Also all other ScrollView Props

const DragAndDropScrollView = memo<Object>((props: Props): Object => {

	const {
		data = [],
		renderItem,
		extraData,
		onSortOrderUpdate,
		onScroll,
		scrollEventThrottle = 12,
		scrollDistanceFactor = {ios: 1, android: 0.2},
		startScrollThresholdFactor = 1,
	} = props;

	const _rowInfo = useRef({});
	const _rowRefs = useRef({});
	const _refSelected = useRef({});
	const _dropIndexesQueue = useRef({});
	const _gridIndexToDrop = useRef(-1);
	const _containerLayoutInfo = useRef({});
	const _hasMoved = useRef(false);
	const _scrollViewRef = useRef({});
	const _scrollOffset = useRef({});
	const _containerRef = useRef({});

	const _animatedScaleGrids = useRef({});
	const _animatedScaleSelected = useRef(new Animated.Value(1));

	const _animatedTop = useRef(new Animated.Value(0));
	const _animatedLeft = useRef(new Animated.Value(0));

	const [ selectedIndex, setSelectedIndex ] = useState(-1);

	const animateSpring = useCallback((animatedValue: Object, toValue: number, configs?: Object = {}, callback?: Function): any => {
		return Animated.spring(animatedValue, {
			toValue,
			stiffness: 5000,
			damping: 500,
			mass: 3,
			useNativeDriver: false,
			...configs,
		}).start((event: Object) => {
			if (event.finished && callback) {
				callback();
			}
		});
	}, []);

	const normalizeGrid = useCallback((key: number) => {
		const animatedScaleDropGrid = _animatedScaleGrids.current[key];
		if (!animatedScaleDropGrid) {
			return;
		}

		animateSpring(animatedScaleDropGrid, 1);
		delete _dropIndexesQueue.current[key];
	}, [animateSpring]);

	const animateDropped = useCallback((callback?: Function) => {
		let _index = _gridIndexToDrop.current;
		if (_gridIndexToDrop.current === -1 || !_dropIndexesQueue.current[_gridIndexToDrop.current]) {
			_index = selectedIndex;
		}

		const dropGrid = _rowInfo.current[_index];
		if (!dropGrid) {
			if (callback) {
				callback();
			}
			return;
		}

		const {
			x,
			y,
		} = dropGrid;
		const {
			x: nextX = 0,
			y: nextY = 0,
		} = (_scrollOffset && _scrollOffset.current) ? _scrollOffset.current : {};
		Animated.parallel([
			animateSpring(_animatedTop.current, y - nextY),
			animateSpring(_animatedLeft.current, x - nextX),
			animateSpring(_animatedScaleSelected.current, 1),
		]).start((event: Object) => {
			if (event.finished && callback) {
				callback();
			}
		});
	}, [animateSpring, selectedIndex]);

	const commonActionsOnRelease = useCallback(() => {
		Object.keys(_dropIndexesQueue.current).forEach((key: string) => {
			normalizeGrid(parseInt(key, 10));
		});
	}, [normalizeGrid]);

	const arrageGrids = useCallback(() => {
		if (_gridIndexToDrop.current === -1) {
			return;
		}
		if (selectedIndex === -1) {
			return;
		}
		if (parseInt(selectedIndex, 10) === parseInt(_gridIndexToDrop.current, 10)) {
			return;
		}
		if (_dropIndexesQueue.current[_gridIndexToDrop.current]) {
			const dropIndex = _gridIndexToDrop.current;
			let newData = [], droppedIndex;
			data.map((dis: Object, i: number): Object => {
				if (parseInt(selectedIndex, 10) !== parseInt(i, 10)) {
					if (parseInt(dropIndex, 10) === parseInt(i, 10)) {
						newData.push(data[selectedIndex]);
						droppedIndex = newData.length - 1;
					} else {
						newData.push(dis);
					}
				}
			});
			let newDataL2 = [];
			if (parseInt(dropIndex, 10) > parseInt(selectedIndex, 10)) {
				let newDataL1 = newData.slice(0, droppedIndex);
				newDataL1.push(data[parseInt(dropIndex, 10)]);
				newDataL2 = newDataL1.concat(newData.slice(droppedIndex));
			} else {
				let newDataL1 = newData.slice(0, droppedIndex + 1);
				newDataL1.push(data[parseInt(dropIndex, 10)]);
				newDataL2 = newDataL1.concat(newData.slice(droppedIndex + 1));
			}
			if (onSortOrderUpdate) {
				onSortOrderUpdate(newDataL2);
			}
		}
	}, [data, onSortOrderUpdate, selectedIndex]);

	const onRelease = useCallback((evt: Object, gestureState: Object) => {
		animateDropped(() => {
			arrageGrids();
			setSelectedIndex(-1);
			_hasMoved.current = false;
			commonActionsOnRelease();
		});
	}, [animateDropped, arrageGrids, commonActionsOnRelease]);

	const _setRowRefs = useCallback((ref: any, index: number) => {
		const _rowRefsNew = {
			..._rowRefs.current,
			[index]: ref,
		};
		_rowRefs.current = _rowRefsNew;
	}, []);

	const _setRowRefSelected = useCallback((ref: any, index: number) => {
		_refSelected.current = ref;
	}, []);

	const _panResponder = useMemo((): Object => {
		return PanResponder.create({
			onStartShouldSetPanResponderCapture: (evt: Object, gestureState: Object): boolean => {
				return false;
			},
			onMoveShouldSetPanResponder: (evt: Object, gestureState: Object): boolean => {
				const { numberActiveTouches } = gestureState;
				if (numberActiveTouches > 1) {
					onRelease();
					return false;
				}
				const shouldSet = selectedIndex !== -1;
				if (shouldSet) {
					_hasMoved.current = true;
				}
				return shouldSet;
			},
			onPanResponderMove: (evt: Object, gestureState: Object) => {
				if (gestureState.numberActiveTouches > 1) {
					onRelease();
					return;
				}
				if (selectedIndex === -1) {
					return;
				}

				const {
					moveX,
					moveY,
				} = gestureState;

				const {
					x: nextX = 0,
					y: nextY = 0,
				} = (_scrollOffset && _scrollOffset.current) ? _scrollOffset.current : {};

				const selectedItemInfo = _rowInfo.current[selectedIndex];
				const {
					width: widthSelected,
					height: heightSelected,
				} = selectedItemInfo;
				const {
					height: containerH,
					y: containerY = 0,
					x: containerX = 0,
				} = _containerLayoutInfo.current;

				const left = moveX - (widthSelected / 2) - containerX;
				const top = moveY - (heightSelected / 2) - containerY;
				_animatedTop.current.setValue(top);
				_animatedLeft.current.setValue(left);

				Object.keys(_rowInfo.current).forEach((key: string) => {
					const {
						x,
						y,
						width: _width,
						height: _height,
					} = _rowInfo.current[key];

					const isDroppable = moveX > x && (top + nextY) > y && moveX < (x + _width) && (top + nextY) < (y + _height);
					if (isDroppable) {
						_dropIndexesQueue.current = {
							..._dropIndexesQueue.current,
							[key]: true,
						};
						_gridIndexToDrop.current = key;

						const animatedScaleDropGrid = _animatedScaleGrids.current[key];
						if (!animatedScaleDropGrid) {
							return;
						}

						animateSpring(animatedScaleDropGrid, 0.8);
					} else if (_dropIndexesQueue.current[key]) {
						normalizeGrid(parseInt(key, 10));
					}

					const shouldMoveDown = top > (containerH - (heightSelected * startScrollThresholdFactor));
					const shouldMoveUp = top < (containerY + (heightSelected * startScrollThresholdFactor));
					const {
						ios,
						android,
					} = scrollDistanceFactor;
					const scrollDistance = Platform.OS === 'ios' ? (heightSelected * ios) : (heightSelected * android);
					if (shouldMoveDown) {
						_scrollViewRef.current.scrollTo({
							x: nextX || 0,
							y: (nextY + scrollDistance) || (containerY + containerH + scrollDistance),
							animated: true,
						});
					}
					if (shouldMoveUp) {
						_scrollViewRef.current.scrollTo({
							x: nextX || 0,
							y: (nextY - scrollDistance) || (containerY + containerH - scrollDistance),
							animated: true,
						});
					}
				});
			},
			onPanResponderTerminationRequest: ({ nativeEvent }: Object, gestureState: Object): boolean => {
				return false;
			},
			onPanResponderRelease: onRelease,
		});
	}, [animateSpring, normalizeGrid, onRelease, scrollDistanceFactor, selectedIndex, startScrollThresholdFactor]);

	const _move = useCallback((index: number) => {
		const selectedItemInfo = _rowInfo.current[index];
		setSelectedIndex(index);
		if (!_refSelected.current) {
			return;
		}

		const {
			x: nextX = 0,
			y: nextY = 0,
		} = (_scrollOffset && _scrollOffset.current) ? _scrollOffset.current : {};

		_animatedTop.current.setValue(selectedItemInfo.y - nextY);
		_animatedLeft.current.setValue(selectedItemInfo.x - nextX);

		animateSpring(_animatedScaleSelected.current, 1.2);
	}, [animateSpring]);

	const _moveEnd = useCallback(() => {
		if (!_hasMoved.current) {
			setSelectedIndex(-1);
			_hasMoved.current = false;
		}
		commonActionsOnRelease();
	}, [commonActionsOnRelease]);

	const _onLayoutRow = useCallback((event: Object, index: number) => {
		const _rowInfoNext = {
			..._rowInfo.current,
			[index]: event.nativeEvent.layout,
		};
		_rowInfo.current = _rowInfoNext;
	}, [_rowInfo]);

	const onLayoutContainer = useCallback((event: Object) => {
		_containerRef.current.measureInWindow((x: number, y: number, _width: number, _height: number) => {
			_containerLayoutInfo.current = {
				x,
				y,
				width: _width,
				height: _height,
			};
		});
	}, []);

	const _onScroll = useCallback((event: Object) => {
		_scrollOffset.current = event.nativeEvent.contentOffset;
		if (onScroll) {
			onScroll(event);
		}
	}, [onScroll]);

	const rows = useMemo((): Array<Object> => {
		return data.map((item: Object, index: number): Object => {

			_animatedScaleGrids.current = {
				[index]: _animatedScaleGrids.current[index] || new Animated.Value(1),
				..._animatedScaleGrids.current,
			};

			return (
				<Row
					key={`${index}`}
					setRowRefs={_setRowRefs}
					onLayout={_onLayoutRow}
					renderItem={renderItem}
					item={item}
					index={index}
					move={_move}
					moveEnd={_moveEnd}
					extraData={extraData}
					style={{
						transform: [{
							scale: _animatedScaleGrids.current[index],
						}],
					}}/>
			);
		});
	}, [data, _setRowRefs, _onLayoutRow, renderItem, _move, _moveEnd, extraData]);

	const selectedItem = useMemo((): null | Object => {
		if (selectedIndex === -1) {
			return null;
		}

		return (
			<Row
				key={`${selectedIndex}-selected`}
				renderItem={renderItem}
				item={data[selectedIndex]}
				index={`${selectedIndex}-selected`}
				moveEnd={_moveEnd}
				setRowRefs={_setRowRefSelected}
				style={{
					position: 'absolute',
					top: _animatedTop.current,
					left: _animatedLeft.current,
					transform: [{
						scale: _animatedScaleSelected.current,
					}],
				}}
				extraData={extraData}/>
		);
	}, [selectedIndex, renderItem, data, _moveEnd, _setRowRefSelected, extraData]);

	return (
		<View
			style={{
				flex: 1,
			}}
			{..._panResponder.panHandlers}
			onLayout={onLayoutContainer}
			ref={_containerRef}>
			<Animated.ScrollView
				// $FlowFixMe
				{...props}
				ref={_scrollViewRef}
				onScroll={_onScroll}
				scrollEventThrottle={scrollEventThrottle}>
				{rows}
			</Animated.ScrollView>
			{!!selectedItem && selectedItem}
		</View>
	);
});

export default DragAndDropScrollView;
