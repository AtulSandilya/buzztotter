import * as React from "react";

import theme from "../theme";
import BevIcon from "./BevIcon";

class RightArrow extends React.Component<{}, {}> {
  public render() {
    return (
      <BevIcon
        iconType="rightArrow"
        size="extraExtraLarge"
        color={theme.colors.uiLight}
        style={{
          paddingLeft: 15,
          paddingVertical: 0,
        }}
      />
    );
  }
}

export default RightArrow;
