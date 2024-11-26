import { darkOrange } from "@/constants/Colors";
import { IconNode } from "@rneui/base";
import { Input } from "@rneui/themed";
import {
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TextInputSubmitEditingEventData,
  View,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

const styles = StyleSheet.create({
  container: {
    width: `90%`,
    backgroundColor: "white",
    padding: 40,
    alignItems: "center",
    borderRadius: 40,
  },
  ctaSection: {
    display: "flex",
    flexDirection: "column",
    width: `70%`,
    marginTop: 20,
  },
  cta: {
    paddingHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 15,
    backgroundColor: darkOrange,
  },
  secondaryCta: {
    marginTop: 15,
  },
  ctaText: {
    textAlign: "center",
    color: "white",
    fontSize: 18,
  },
});

type Field = {
  placeholder: string;
  label: string;
  icon?: IconNode;
  value: string; // only text fields needed, otherwise we would need a generic type or multiple types
  secured?: boolean;
  onChange: (val: string) => void;
  onSubmit: (e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => void;
};

type CTA = {
  text: string;
  onPress: () => void;
};

type Props = {
  fields: Field[];
  primaryCta: CTA;
  secondaryCta?: CTA;
};

export default function LoginForm({ fields, primaryCta, secondaryCta }: Props) {
  return (
    <View style={styles.container}>
      {fields.map(
        (
          { placeholder, label, icon, value, onChange, onSubmit, secured },
          i
        ) => (
          <Input
            key={i}
            placeholder={placeholder}
            label={label}
            leftIcon={icon}
            value={value}
            onChangeText={onChange}
            onSubmitEditing={onSubmit}
            secureTextEntry={secured}
          />
        )
      )}

      <View style={styles.ctaSection}>
        <TouchableOpacity onPress={primaryCta.onPress} style={styles.cta}>
          <Text style={styles.ctaText}>{primaryCta.text}</Text>
        </TouchableOpacity>
        {secondaryCta && (
          <TouchableOpacity
            onPress={secondaryCta.onPress}
            style={{ ...styles.cta, ...styles.secondaryCta }}
          >
            <Text style={styles.ctaText}>{secondaryCta.text}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
