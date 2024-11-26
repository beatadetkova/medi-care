import { darkOrange } from "@/constants/Colors";
import { Avatar } from "@rneui/base";
import { StyleSheet, Text, View } from "react-native";

const styles = StyleSheet.create({
  card: {
    width: "100%",
    height: "auto",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  textArea: {
    flexDirection: "row",
    alignContent: "center",
    padding: 10,
    gap: 10,
    width: `100%`,
    borderWidth: 0.5,
    borderRadius: 5,
    borderColor: "#cccaca",
    backgroundColor: "white",
  },
  nameText: {
    alignSelf: "center",
    color: darkOrange,
    fontSize: 14,
    fontWeight: "900",
  },
});

type Props = {
  name: string;
};

export default function UserCard({ name }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.textArea}>
        <Avatar
          size={32}
          rounded
          icon={{ name: "user", type: "font-awesome" }}
          containerStyle={{ backgroundColor: darkOrange }}
        />
        <Text style={styles.nameText}>{name}</Text>
      </View>
    </View>
  );
}
