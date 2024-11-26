import { darkOrange } from "@/constants/Colors";
import { Icon } from "@rneui/base";

type Props = {
  name: string;
  onPress: () => void;
};

export default function IconButton({ name, onPress, ...props }: Props) {
  return (
    <Icon
      raised
      name={name}
      type="font-awesome"
      color={darkOrange}
      onPress={onPress}
    />
  );
}
