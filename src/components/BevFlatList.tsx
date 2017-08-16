import * as React from "react";
import { FlatList, RefreshControl, View } from "react-native";

import { globalColors, globalStyles } from "./GlobalStyles";

interface BevFlatListProps {
  data: any[];
  // I can't get the types exactly right here but renderItemComponent needs to
  // be a pure component! FlatList only works with `PureComponent`
  renderItemPureComponent: any;
  isRefreshing: boolean;
  onRefresh: () => void;
  refreshText: string;
  keyExtractor?: (item: any, index: number) => any;
}

/* tslint:disable:member-ordering */
/* tslint:disable:max-classes-per-file */
class BevFlatList extends React.PureComponent<BevFlatListProps, {}> {
  private initialNumToRender = 20;

  private keyExtractor(item, index) {
    return item;
  }

  public render() {
    const RenderItemPureComponent = this.props.renderItemPureComponent;
    return (
      <FlatList
        data={this.props.data}
        renderItem={({ item, index }) => {
          return <RenderItemPureComponent item={item} index={index} />;
        }}
        // I have no idea why this needs to be a class and can't be a component
        ItemSeparatorComponent={ListSeparator}
        keyExtractor={
          this.props.keyExtractor ? this.props.keyExtractor : this.keyExtractor
        }
        initialNumToRender={this.initialNumToRender}
        refreshing={this.props.isRefreshing}
        refreshControl={
          <RefreshControl
            refreshing={this.props.isRefreshing}
            onRefresh={() => {
              if (!this.props.isRefreshing) {
                this.props.onRefresh();
              }
            }}
            title={this.props.refreshText}
            tintColor={globalColors.bevPrimary}
            colors={[globalColors.bevPrimary]}
          />
        }
      />
    );
  }
}

class ListSeparator extends React.Component<{}, {}> {
  public render() {
    return <View style={globalStyles.listRowSeparator} />;
  }
}

export default BevFlatList;
