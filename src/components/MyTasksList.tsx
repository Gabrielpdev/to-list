import React from "react";
import {
  FlatList,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
} from "react-native";

function FlatListHeaderComponent() {
  return (
    <View>
      <Text style={styles.header}>Minha lista</Text>
    </View>
  );
}

interface MyTasksListProps {
  tasks: {
    id: number;
    title: string;
    done: boolean;
  }[];
  onPress: (id: number) => void;
  onLongPress: (id: number) => void;
}

export function MyTasksList({ tasks, onLongPress, onPress }: MyTasksListProps) {
  return (
    <FlatList
      data={tasks}
      keyExtractor={(item) => String(item?.id)}
      renderItem={({ item, index }) => {
        return (
          <TouchableOpacity
            testID={`button-${index}`}
            activeOpacity={0.7}
            style={item?.done ? styles.taskButtonDone : styles.taskButton}
            onPress={() => onPress(item?.id)}
            onLongPress={() => onLongPress(item?.id)}
          >
            <View
              testID={`marker-${index}`}
              style={item?.done ? styles.taskMarkerDone : styles.taskMarker}
            />
            <Text style={item?.done ? styles.taskTextDone : styles.taskText}>
              {item?.title}
            </Text>
          </TouchableOpacity>
        );
      }}
      ListHeaderComponent={<FlatListHeaderComponent />}
      ListHeaderComponentStyle={{
        marginBottom: 20,
      }}
      style={{
        marginHorizontal: 24,
        marginTop: 32,
      }}
    />
  );
}

const styles = StyleSheet.create({
  header: {
    color: "#565BFF",
    fontSize: 24,
    fontFamily: "Poppins_600SemiBold",
  },
  taskButton: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 12,
    marginBottom: 4,
    borderRadius: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  taskMarker: {
    height: 16,
    width: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#565BFF",
    marginRight: 10,
  },
  taskText: {
    color: "#E1E1E6",
  },
  taskButtonDone: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 12,
    marginBottom: 4,
    borderRadius: 4,
    backgroundColor: "rgba(33, 33, 54, .3)",
    flexDirection: "row",
    alignItems: "center",
  },
  taskMarkerDone: {
    height: 16,
    width: 16,
    borderRadius: 8,
    backgroundColor: "#565BFF",
    marginRight: 10,
    opacity: 0.3,
  },
  taskTextDone: {
    color: "#A09CB1",
    textDecorationLine: "line-through",
    opacity: 0.3,
  },
});
