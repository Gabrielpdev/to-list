import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { addDays, isPast } from "date-fns";

import { Header } from "../components/Header";
import { MyTasksList } from "../components/MyTasksList";
import { TodoInput } from "../components/TodoInput";

import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  onValue,
  set,
  remove,
  update,
} from "firebase/database";

interface Task {
  id: number;
  title: string;
  done: boolean;
}

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
};

export function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);

  function handleAddTask(newTaskTitle: string) {
    if (newTaskTitle) {
      const db = getDatabase();
      const id = new Date().getTime();

      const reference = ref(db, `list/${id}`);
      set(reference, {
        id,
        title: newTaskTitle,
        done: false,
      });
    }
  }

  function handleMarkTaskAsDone(id: number) {
    tasks.forEach((task) => {
      if (task.id === id) {
        const db = getDatabase();
        const reference = ref(db, `list`);

        update(reference, {
          [id]: {
            ...task,
            done: !task.done,
            validate: addDays(new Date(), 15),
          },
        });
      }
    });
  }

  function handleRemoveTask(id: number) {
    const db = getDatabase();
    const reference = ref(db, `list/${id}`);
    remove(reference);
  }

  function getData() {
    const db = getDatabase();
    const reference = ref(db, "list");
    onValue(reference, (snapshot) => {
      const highScore = snapshot.val();

      if (highScore) {
        const data = Object.keys(highScore).map(function (key) {
          return highScore[key];
        });

        const filteredData = data.filter((task) => {
          if (isPast(new Date(task.validate))) {
            const removeId = ref(db, `list/${task.id}`);
            remove(removeId);
          }

          return !isPast(new Date(task.validate));
        });

        setTasks(filteredData);
      } else {
        setTasks([]);
      }
    });
  }

  useEffect(() => {
    initializeApp(firebaseConfig);

    getData();
  }, []);

  return (
    <View style={styles.container}>
      <Header />

      <TodoInput addTask={handleAddTask} />

      {tasks?.[0] && (
        <MyTasksList
          tasks={tasks}
          onPress={handleMarkTaskAsDone}
          onLongPress={handleRemoveTask}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#10101E",
  },
});
