# react-native-drag-and-drop-scroll-view

Drag and Drop supported dynamic scrollview for react-native. Inspired by [react-native-draggable-dynamic-flatlist](https://github.com/thomasrovayaz/react-native-draggable-dynamic-flatlist#readme).

## Getting started

`$ npm install react-native-drag-and-drop-scroll-view --save`

### Mostly automatic installation

`$ react-native link react-native-drag-and-drop-scroll-view`

## Usage
```javascript
import {TouchableOpacity} from 'react-native';
import DragAndDropScrollView from 'react-native-drag-and-drop-scroll-view';

const Screen = (props) => {
    const _onSortOrderUpdate = (data) => {
    }

    const _renderRow = ({move, moveEnd, item}) => {
        return (
            <TouchableOpacity
            onLongPress={move}
            onPressOut={moveEnd}>
            ..........
            </TouchableOpacity>
        )
    }

    return (
        <DragAndDropScrollView
        data={['1', '2']}
        renderItem={_renderRow}
        onSortOrderUpdate={_onSortOrderUpdate}/>
    );
}
```
