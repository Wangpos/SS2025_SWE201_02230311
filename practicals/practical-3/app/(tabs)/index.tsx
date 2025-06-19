import Ionicons from '@expo/vector-icons/Ionicons';
import { addDoc, collection, deleteDoc, doc, DocumentData, onSnapshot, QuerySnapshot, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { FIRESTORE_DB } from '../../firebaseConfig';

export interface Todo{
  title: string;
  done: boolean;
  id: string;
}

const List = ({ navigation }: any) => {
    const [todos, setTodos] = React.useState<Todo []>([]);
    const [todo, setTodo] = useState('');

    useEffect(() => {
        const todoRef = collection(FIRESTORE_DB, 'todos');
        const subscribe = onSnapshot(todoRef, {
            next: (snapshot: QuerySnapshot<DocumentData>) => {
                const todos: { id: string; title?: string; done?: boolean }[] = [];
                snapshot.docs.forEach((doc) => {
                    todos.push({
                        id: doc.id,
                        ...doc.data(),
                    });
                });
                setTodos(todos);
            },
        });
        return () => subscribe();
    }, []);

    const addTodo = async () => {
        await addDoc(collection(FIRESTORE_DB, 'todos'), {title: todo, done: false});
        setTodo('');
    };

    const renderTodo = ({ item }: any) => {
      const ref = doc(FIRESTORE_DB, `todos/${item.id}`);

      const toggleDone = async () => {
        await updateDoc(ref, { done: !item.done });
      };

      const deleteItem = async () => {
        await deleteDoc(ref);
      };

      return (
        <View style={[styles.todoCard, item.done && styles.todoCardDone]}>
          <TouchableOpacity onPress={toggleDone} style={styles.checkCircle}>
            {item.done ? (
              <Ionicons name="checkmark-circle" size={28} color="#2ecc71" />
            ) : (
              <Ionicons name="ellipse-outline" size={28} color="#b2bec3" />
            )}
          </TouchableOpacity>
          <Text style={[styles.todoTitle, item.done && styles.todoTitleDone]}>
            {item.title}
          </Text>
          <TouchableOpacity onPress={deleteItem} style={styles.deleteIcon}>
            <Ionicons name="trash-bin" size={22} color="#d63031" />
          </TouchableOpacity>
        </View>
      );
    };

    const completedCount = todos.filter(todo => todo.done).length;
    const totalCount = todos.length;

    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#f4f6fb" />

        {/* Compact Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Tasks</Text>
          <Text style={styles.headerStats}>
            {completedCount} / {totalCount} done
          </Text>
        </View>

        {/* List Section */}
        <View style={styles.listSection}>
          {todos.length > 0 ? (
            <FlatList
              data={todos}
              renderItem={renderTodo}
              keyExtractor={(todo: Todo) => todo.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
            />
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="cloud-offline-outline" size={56} color="#dfe6e9" />
              <Text style={styles.emptyText}>Nothing here yet.</Text>
              <Text style={styles.emptySubtext}>Add your first task below!</Text>
            </View>
          )}
        </View>

        {/* Floating Add Input */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.addSection}
        >
          <View style={styles.addInputContainer}>
            <TextInput
              placeholder="Add a new task..."
              onChangeText={setTodo}
              value={todo}
              style={styles.addInput}
              placeholderTextColor="#b2bec3"
            />
            <TouchableOpacity
              style={[styles.addButton, !todo && styles.addButtonDisabled]}
              onPress={addTodo}
              disabled={!todo}
            >
              <Ionicons name="add" size={28} color="white" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    );
};

export default List;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6fb',
  },
  header: {
    paddingTop: 48,
    paddingBottom: 16,
    paddingHorizontal: 24,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: 'center',
    shadowColor: '#636e72',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#222f3e',
    letterSpacing: 1,
  },
  headerStats: {
    marginTop: 4,
    fontSize: 14,
    color: '#636e72',
  },
  listSection: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  listContent: {
    paddingBottom: 80,
  },
  todoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginVertical: 6,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#636e72',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  todoCardDone: {
    opacity: 0.5,
    backgroundColor: '#dfe6e9',
  },
  checkCircle: {
    marginRight: 14,
  },
  todoTitle: {
    flex: 1,
    fontSize: 16,
    color: '#222f3e',
  },
  todoTitleDone: {
    textDecorationLine: 'line-through',
    color: '#636e72',
  },
  deleteIcon: {
    marginLeft: 8,
    padding: 4,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  emptyText: {
    fontSize: 20,
    color: '#636e72',
    fontWeight: '600',
    marginTop: 18,
  },
  emptySubtext: {
    fontSize: 15,
    color: '#b2bec3',
    marginTop: 4,
  },
  addSection: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    backgroundColor: 'transparent',
  },
  addInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 8,
    shadowColor: '#636e72',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 5,
  },
  addInput: {
    flex: 1,
    fontSize: 16,
    color: '#222f3e',
    paddingVertical: 6,
  },
  addButton: {
    backgroundColor: '#0984e3',
    marginLeft: 12,
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  addButtonDisabled: {
    backgroundColor: '#dfe6e9',
  },
});
