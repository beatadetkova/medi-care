import { lightPink } from "@/constants/Colors";
import {
  ImageBackground,
  ImageSourcePropType,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

const styles = StyleSheet.create({
  main: {
    width: `100%`,
    height: `100%`,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: lightPink,
  },
  layout: {
    width: `100%`,
    height: `100%`,
    maxWidth: 600,
  },
});

type Props = {
  imageSrc?: ImageSourcePropType;
  style?: ViewStyle;
  children: React.ReactNode;
};

const Main = ({ children }: Pick<Props, "children">) => (
  <View style={styles.main}>{children}</View>
);

export default function Layout({ imageSrc, style = {}, children }: Props) {
  const layoutStyle = { ...styles.layout, ...style };
  if (imageSrc) {
    return (
      <Main>
        <ImageBackground
          imageStyle={{ backgroundColor: lightPink, top: -200 }}
          source={imageSrc}
          resizeMode="contain"
          style={layoutStyle}
        >
          {children}
        </ImageBackground>
      </Main>
    );
  }

  return (
    <Main>
      <View style={layoutStyle}>{children}</View>
    </Main>
  );
}
