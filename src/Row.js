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
} from 'react';
import {
	Animated,
} from 'react-native';

const Row = memo<Object>((props: Object): Object => {
	const {
		renderItem,
		item,
		index,
		moveEnd,
		move,
		onLayout,
		style,
		setRowRefs,
		extraData,
	} = props;

	const _move = useCallback(() => {
		if (move) {
			move(index);
		}
	}, [index, move]);

	const _onLayout = useCallback((event: Object) => {
		if (onLayout) {
			onLayout(event, index);
		}
	}, [index, onLayout]);

	const component = useMemo((): Object => {
		return renderItem({
			isActive: false,
			item,
			index,
			move: _move,
			moveEnd,
			extraData,
		});
	}, [_move, index, item, moveEnd, renderItem, extraData]);

	const _setRowRefs = useCallback((ref: any) => {
		if (setRowRefs) {
			setRowRefs(ref, index);
		}
	}, [index, setRowRefs]);

	return (
		<Animated.View
			ref={_setRowRefs}
			onLayout={_onLayout}
			style={style}>
			{component}
		</Animated.View>
	);
});

export default Row;
