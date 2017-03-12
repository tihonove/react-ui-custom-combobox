// @flow
import React from 'react';
import Helmet from 'react-helmet';
import Input from 'retail-ui/components/Input';

import CustomCombobox, { defaultBehaviour } from './CustomCombobox';

type Item = {
    id: string;
    name: string;
}

const items = new Array(20).fill(0).map((x, i) => ({
    id: `id-${i}`,
    name: `Name ${i}`,
}));

function delay(timeout: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

async function findItems(query: string): Promise<Item[]> {
    await delay(1000);
    return items.filter(x => x.name.includes(query));
}

async function getItemById(id: string): Promise<Item | null> {
    await delay(500);
    const results = items.filter(x => x.id === id);
    if (results.length === 1) {
        return results[0];
    }
    return null;
}

export default class CustomComboboxDemo extends React.Component {
    state = {
        itemId: null,
        itemId1: 'id-4',
        itemId2: 'id-1',
        itemId3: 'id-2',
        itemId4: 'id-3',
    };

    handleSubmit() {
        this.refs.container.submit();
    }

    render(): React.Element<*> {
        return (
            <div>
                <Helmet title='Custom Combobox Demo' />
                <h1>Custom Combobox Demo</h1>
                <h4>Обычный кобобокс</h4>
                <CustomCombobox
                    findItems={findItems}
                    itemToValue={x => x.id}
                    valueToItem={getItemById}
                    itemToString={x => x && x.name}
                    value={this.state.itemId}
                    onChange={(value) => this.setState({ itemId: value })}
                    manager={defaultBehaviour}
                />

                <h4>Кобобокс с начальным значением</h4>
                <CustomCombobox
                    findItems={findItems}
                    itemToValue={x => x.id}
                    valueToItem={getItemById}
                    itemToString={x => x && x.name}
                    value={this.state.itemId1}
                    onChange={(value) => this.setState({ itemId1: value })}
                    manager={defaultBehaviour}
                />

                <h4>Рядом с Input-ом</h4>
                <CustomCombobox
                    findItems={findItems}
                    itemToValue={x => x.id}
                    valueToItem={getItemById}
                    itemToString={x => x && x.name}
                    value={this.state.itemId2}
                    onChange={(value) => this.setState({ itemId2: value })}
                    manager={defaultBehaviour}
                />
                <Input value='text' />

                <h4>Переходы по tab-у</h4>
                <Input value='text' />
                <CustomCombobox
                    findItems={findItems}
                    itemToValue={x => x.id}
                    valueToItem={getItemById}
                    itemToString={x => x && x.name}
                    value={this.state.itemId3}
                    onChange={(value) => this.setState({ itemId3: value })}
                    manager={defaultBehaviour}
                />
                <CustomCombobox
                    findItems={findItems}
                    itemToValue={x => x.id}
                    valueToItem={getItemById}
                    itemToString={x => x && x.name}
                    value={this.state.itemId4}
                    onChange={(value) => this.setState({ itemId4: value })}
                    manager={defaultBehaviour}
                />
            </div>
        );
    }
}


