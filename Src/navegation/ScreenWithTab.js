import React from "react";
import { View } from "react-native";
import BottomTab from "../../components/BottomTab";

export default function ScreenWithTab({ children, tabs, initialTab }) {
    return (
        <View style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>{children}</View>
            <BottomTab tabs={tabs} initialTab={initialTab} />
        </View>
    );
}
