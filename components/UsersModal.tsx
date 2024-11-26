import { darkOrange, lightPink } from "@/constants/Colors";
import { User } from "@/types/entities";
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import IconButton from "./IconButton";
import UserCard from "./UserCard";

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    margin: 0,
    width: `100%`,
    height: `100%`,
    backgroundColor: lightPink,
    paddingVertical: 35,
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  iconButton: {
    alignSelf: "flex-end",
  },
  centeringView: {
    width: `100%`,
    height: `100%`,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  noUserText: {
    fontSize: 26,
  },
});

type Props = {
  isVisible: boolean;
  isLoading: boolean;
  users: User[];
  onClick: (id: string) => void;
  onClose: () => void;
};

export default function UsersModal({
  isVisible,
  isLoading,
  users,
  onClick,
  onClose,
}: Props) {
  if (isLoading) {
    return (
      <Modal animationType="fade" visible={isVisible} style={styles.modal}>
        <View style={styles.centeringView}>
          <ActivityIndicator size="large" color={darkOrange} />
        </View>
      </Modal>
    );
  }

  return (
    <Modal animationType="fade" visible={isVisible} style={styles.modal}>
      <View style={styles.iconButton}>
        <IconButton name="close" onPress={onClose} />
      </View>

      <FlatList
        data={users}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity onPress={() => onClick(item.id)}>
              <UserCard name={item.displayName} />
            </TouchableOpacity>
          );
        }}
      />

      {users.length === 0 && (
        <View style={styles.centeringView}>
          <Text style={styles.noUserText}>No users</Text>
        </View>
      )}
    </Modal>
  );
}
