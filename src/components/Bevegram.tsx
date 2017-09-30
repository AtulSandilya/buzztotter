import * as React from "react";
import { View } from "react-native";

import theme from "../theme";

import BevAvatar from "./BevAvatar";
import BevButton from "./BevButton";
import BevText from "./BevText";
import BevTimestamp from "./BevTimestamp";
import { styles } from "./Contact";

export interface SelectedBevegramPackage {
  id: string;
  from: string;
  quantity: number;
}

export interface BevegramProps {
  from: string;
  date: number;
  id: string;
  imagePath: string;
  message: string;
  quantity: number;
  displayAsUnseen: boolean;
  goToRedeem?(routeData: SelectedBevegramPackage): void;
  openMessage?(data: MessageData): void;
}

export interface MessageData {
  date: number;
  from: string;
  message: string;
  photoUrl: string;
}

const Bevegram: React.StatelessComponent<BevegramProps> = ({
  from,
  date,
  id,
  quantity,
  goToRedeem,
  imagePath,
  message,
  displayAsUnseen,
  openMessage,
}) => (
  <View style={styles.parentContainer}>
    <View style={styles.infoContainer}>
      <BevAvatar imageUrl={imagePath} />
      <View style={styles.infoTextContainer}>
        <BevText
          fontWeight={displayAsUnseen ? "bold" : "normal"}
          textStyle={{
            paddingBottom: theme.padding.extraExtraSmall,
          }}
        >
          {from}
        </BevText>
        <BevTimestamp date={date} />
      </View>
    </View>
    <View style={styles.buttonContainer}>
      {message !== undefined ? (
        <BevButton
          text="Read"
          shortText=""
          onPress={() => {
            openMessage({
              date,
              from,
              message,
              photoUrl: imagePath,
            });
          }}
          iconType="messageUnread"
          isListButton={true}
          type="secondary"
        />
      ) : null}
      <BevButton
        text="Redeem"
        shortText="Redeem"
        label="Redeem Bevegram Button"
        onPress={() => goToRedeem({ id, from, quantity })}
        iconType={message === undefined ? "beer" : undefined}
        isListButton={true}
      />
    </View>
  </View>
);

export default Bevegram;
