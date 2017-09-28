import * as React from "react";

import { View, WebView } from "react-native";

import { BrandingHeight } from "./Branding";

const TermsAndConditions: React.StatelessComponent<{}> = props => {
  const termsAndConditionsHtml = require("../../website/terms_and_conditions.html");
  return (
    <View style={{ flex: 1 }}>
      <View style={{ height: BrandingHeight }} />
      <WebView source={termsAndConditionsHtml} style={{ flex: 1 }} />
    </View>
  );
};

export default TermsAndConditions;
