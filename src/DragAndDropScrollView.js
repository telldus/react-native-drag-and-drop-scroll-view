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
	Image,
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
	enableDragDrop?: boolean,
	showBin?: boolean,
	onDelete?: (number, any, Array<any>, Object) => void,
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
		enableDragDrop = true,
		showBin = false,
		onDelete,
	} = props;

	const _rowRefs = useRef({});
	const _refSelected = useRef({});
	const _dropIndexesQueue = useRef({});
	const _gridIndexToDrop = useRef(-1);

	const _rowInfo = useRef({});
	const _containerLayoutInfo = useRef({});
	const _binLayoutInfo = useRef({});

	const _hasMoved = useRef(false);
	const _scrollViewRef = useRef({});
	const _scrollOffset = useRef({});
	const _containerRef = useRef({});
	const _binRef: any = useRef({});

	const _animatedScaleGrids = useRef({});
	const _animatedScaleSelected = useRef(new Animated.Value(1));
	const _animatedScaleBin = useRef(new Animated.Value(0));

	const _animatedWidthDeleting = useRef(new Animated.Value(0));
	const _animatedOpacityBin = useRef(new Animated.Value(0));
	const _shouldDelete = useRef(false);

	const _animatedTop = useRef(new Animated.Value(0));
	const _animatedLeft = useRef(new Animated.Value(0));

	const [ selectedIndex, setSelectedIndex ] = useState(-1);
	const [ deleteConf, setDeleteConf ] = useState({
		index: -1,
		animate: false,
	});

	useEffect(() => {
		const numberOfItems = data.length;
		const infoListLength = Object.keys(_rowInfo.current).length;
		const scaleListLength = Object.keys(_animatedScaleGrids.current).length;
		if (infoListLength > numberOfItems) {
			for (let i = (numberOfItems); i < infoListLength; i++) {
				delete _rowInfo.current[i];
			}
		}
		if (scaleListLength > numberOfItems) {
			for (let i = (numberOfItems); i < scaleListLength; i++) {
				delete _animatedScaleGrids.current[i];
			}
		}
	}, [data]);

	const animateTiming = useCallback((animatedValue: Object, toValue: number, configs: Object = {}, callback?: Function): any => {
		return Animated.timing(animatedValue, {
			toValue,
			useNativeDriver: false,
			...configs,
		}).start((event: Object) => {
			if (event.finished && callback) {
				callback();
			}
		});
	}, []);

	const animateDeleted = useCallback((callback: Function) => {
		if (deleteConf.index !== -1) {
			setDeleteConf({
				...deleteConf,
				animate: true,
			});
			const selectedItemInfo = _rowInfo.current[deleteConf.index];
			const {
				width: widthSelected,
			} = selectedItemInfo;
			_animatedWidthDeleting.current.setValue(widthSelected);

			animateTiming(_animatedWidthDeleting.current, 0, {duration: 300}, () => {
				if (callback) {
					callback();
				}
				setDeleteConf({
					index: -1,
					animate: false,
				});
			});
		}
	}, [animateTiming, deleteConf]);

	const normalizeGrid = useCallback((key: number) => {
		const animatedScaleDropGrid = _animatedScaleGrids.current[key];
		if (!animatedScaleDropGrid) {
			return;
		}

		animateTiming(animatedScaleDropGrid, 1, {duration: 50});
		delete _dropIndexesQueue.current[key];
	}, [animateTiming]);

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

		let animatedTop = y;
		let animatedLeft = x;
		let animatedScale = 1;
		if (_shouldDelete.current) {
			const {
				x: xBin = 0,
				y: yBin = 0,
				height: heightBin = 0,
			}: Object = _binLayoutInfo.current || {};
			const selectedItemInfo = _rowInfo.current[selectedIndex];
			const {
				width: widthSelected,
				height: heightSelected,
			} = selectedItemInfo;

			animatedTop = yBin - (heightSelected * 0.5) + (heightBin * 0.5);
			animatedLeft = xBin + (widthSelected * 0.5);
			animatedScale = 0;
		}
		animatedTop = animatedTop - nextY;
		animatedLeft = animatedLeft - nextX;

		Animated.parallel([
			animateTiming(_animatedTop.current, animatedTop, {duration: 200}),
			animateTiming(_animatedLeft.current, animatedLeft, {duration: 200}),
			animateTiming(_animatedScaleSelected.current, animatedScale, {duration: 200}),
		]).start((event: Object) => {
			if (event.finished && callback) {
				callback();
			}
		});
	}, [animateTiming, selectedIndex]);

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

			newDataL2 = newDataL2.filter((element: any): boolean => element !== undefined);

			if (onSortOrderUpdate) {
				onSortOrderUpdate(newDataL2);
			}
		}
	}, [data, onSortOrderUpdate, selectedIndex]);

	const onRelease = useCallback((evt: Object, gestureState: Object) => {
		animateDropped(() => {
			animateTiming(_animatedScaleBin.current, 0, {duration: 300, delay: _shouldDelete.current ? 500 : 200}, () => {
				if (_shouldDelete.current && onDelete && selectedIndex !== -1) {
					onDelete(selectedIndex, data[selectedIndex], data, {animateDeleted});
				}
				arrageGrids();
				_hasMoved.current = false;
				commonActionsOnRelease();
				setSelectedIndex(-1);
			});
		});
	}, [animateDeleted, animateDropped, animateTiming, arrageGrids, commonActionsOnRelease, data, onDelete, selectedIndex]);

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
		if (!enableDragDrop) {
			return {};
		}
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

				const _moveX = moveX - containerX;
				const _moveY = moveY - containerY;
				const left = _moveX - (widthSelected / 2);
				const top = _moveY - (heightSelected / 2);
				_animatedTop.current.setValue(top);
				_animatedLeft.current.setValue(left);

				const {
					index: delIndex,
					animate: delAnimate,
				} = deleteConf;

				const {
					x1: x1Bin = 0,
					y1: y1Bin = 0,
					height: heightBin = 0,
					width: widthBin = 0,
				}: Object = _binLayoutInfo.current || {};
				if (showBin && heightBin) {
					const proximity = 10;
					const shallRemove = moveX > (x1Bin - proximity) && (moveY + nextY) > (y1Bin - proximity) && moveX < (x1Bin + widthBin + proximity) && (moveY + nextY) < (y1Bin + heightBin + proximity);
					if (shallRemove) {
						if (delIndex !== selectedIndex) {
							setDeleteConf({
								...deleteConf,
								index: selectedIndex,
							});
						}

						_animatedOpacityBin.current.setValue(1);
						commonActionsOnRelease();
						_gridIndexToDrop.current = -1;
						_shouldDelete.current = true;
						return;
					}

					if (_animatedOpacityBin.current.__getValue() !== 0.5) {
						_animatedOpacityBin.current.setValue(0.5);
					}
				}

				if (delAnimate || delIndex !== -1) {
					setDeleteConf({
						index: -1,
						animate: false,
					});
				}

				_shouldDelete.current = false;

				Object.keys(_rowInfo.current).forEach((key: string) => {
					const {
						x,
						y,
						width: _width,
						height: _height,
					} = _rowInfo.current[key];

					const isDroppable = moveX > x && (_moveY + nextY) > y && moveX < (x + _width) && (_moveY + nextY) < (y + _height);
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

						animateTiming(animatedScaleDropGrid, 0.8, {duration: 50});
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
	}, [deleteConf, enableDragDrop, onRelease, selectedIndex, showBin, commonActionsOnRelease, startScrollThresholdFactor, scrollDistanceFactor, animateTiming, normalizeGrid]);

	const _move = useCallback((index: number) => {
		if (!enableDragDrop) {
			return;
		}

		const selectedItemInfo = _rowInfo.current[index];
		setSelectedIndex(index);
		setDeleteConf({
			index: -1,
			animate: false,
		});

		if (!_refSelected.current) {
			return;
		}

		const {
			x: nextX = 0,
			y: nextY = 0,
		} = (_scrollOffset && _scrollOffset.current) ? _scrollOffset.current : {};

		_animatedTop.current.setValue(selectedItemInfo.y - nextY);
		_animatedLeft.current.setValue(selectedItemInfo.x - nextX);

		_animatedScaleSelected.current.setValue(1);
		_animatedScaleBin.current.setValue(0);
		_animatedOpacityBin.current.setValue(0.5);

		Animated.parallel([
			animateTiming(_animatedScaleSelected.current, 1.2, {duration: 300}),
			animateTiming(_animatedScaleBin.current, 1, {duration: 300}),
		]).start();
	}, [animateTiming, enableDragDrop]);

	const _moveEnd = useCallback(() => {
		if (!enableDragDrop) {
			return;
		}

		if (!_hasMoved.current) {
			animateTiming(_animatedScaleBin.current, 0, {duration: 300}, () => {
				commonActionsOnRelease();
				setSelectedIndex(-1);
				_hasMoved.current = false;
			});
		}
	}, [commonActionsOnRelease, enableDragDrop, animateTiming]);

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

	const onLayoutBin = useCallback((event: Object) => {
		_binLayoutInfo.current = {
			...event.nativeEvent.layout,
		};
		_binRef.current.measureInWindow((x1: number, y1: number, _width: number, _height: number) => {
			_binLayoutInfo.current = {
				..._binLayoutInfo.current,
				x1,
				y1,
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

			const {
				index: delIndex,
				animate: delAnimate,
			} = deleteConf;

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
						width: (index === delIndex) && delAnimate ? _animatedWidthDeleting.current : undefined,
						overflow: 'hidden',
						transform: [{
							scale: _animatedScaleGrids.current[index],
						}],
					}}/>
			);
		});
	}, [data, _setRowRefs, _onLayoutRow, renderItem, _move, _moveEnd, extraData, deleteConf]);

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
					opacity: 0.8,
					transform: [{
						scale: _animatedScaleSelected.current,
					}],
				}}
				extraData={extraData}/>
		);
	}, [selectedIndex, renderItem, data, _moveEnd, _setRowRefSelected, extraData]);

	const outputRange: Array<string> = ['#d9534f30', '#d9534f'];

	return (
		<>
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
				{(selectedIndex !== -1 && showBin) &&
				<Animated.View style={{
					position: 'absolute',
					alignSelf: 'center',
					alignItems: 'center',
					justifyContent: 'center',
					width: '60%',
					paddingVertical: 5,
					borderRadius: 4,
					backgroundColor: _animatedOpacityBin.current.interpolate({
						inputRange: [0, 1],
						outputRange: outputRange,
					}),
					transform: [{
						scaleY: _animatedScaleBin.current,
					}],
					top: 10,
					elevation: 2,
					shadowColor: '#000',
					shadowRadius: 2,
					shadowOpacity: 0.23,
					shadowOffset: {
						width: 0,
						height: 1,
					},
				}}
				onLayout={onLayoutBin}
				ref={_binRef}>
					<Image
						source={require('./bin.png')}
						style={{
							height: 30,
							width: 30,
							tintColor: '#fff',
						}}/>
				</Animated.View>
				}
				{!!selectedItem && selectedItem}
			</View>
		</>
	);
});

export default DragAndDropScrollView;
