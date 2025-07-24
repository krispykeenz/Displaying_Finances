import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AppDispatch, RootState } from '../store/store';
import { addExpense } from '../store/expenseSlice';

const AddExpenseScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { categories } = useSelector((state: RootState) => state.expenses);
  
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState<'expense' | 'income'>('expense');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleAddExpense = async () => {
    if (!amount || !description || !selectedCategory) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'User not found');
      return;
    }

    const expenseData = {
      userId: user.id,
      amount: parseFloat(amount),
      description,
      category: selectedCategory,
      type: selectedType,
      date: date.toISOString(),
    };

    try {
      await dispatch(addExpense(expenseData)).unwrap();
      setAmount('');
      setDescription('');
      setSelectedCategory('');
      setSelectedType('expense');
      setDate(new Date());
      Alert.alert('Success', 'Expense added successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to add expense');
    }
  };

  const onDateChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Add Transaction</Text>
        <Text style={styles.headerSubtitle}>Record your income or expense</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.typeSelector}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              selectedType === 'expense' && styles.typeButtonActive,
              { backgroundColor: selectedType === 'expense' ? '#FF6B6B' : '#F0F0F0' }
            ]}
            onPress={() => setSelectedType('expense')}
          >
            <Text style={[
              styles.typeButtonText,
              { color: selectedType === 'expense' ? 'white' : '#666' }
            ]}>
              Expense
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.typeButton,
              selectedType === 'income' && styles.typeButtonActive,
              { backgroundColor: selectedType === 'income' ? '#4CAF50' : '#F0F0F0' }
            ]}
            onPress={() => setSelectedType('income')}
          >
            <Text style={[
              styles.typeButtonText,
              { color: selectedType === 'income' ? 'white' : '#666' }
            ]}>
              Income
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Amount</Text>
          <TextInput
            style={styles.input}
            placeholder="0.00"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter description"
            value={description}
            onChangeText={setDescription}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.categoryContainer}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryButton,
                    selectedCategory === category.name && styles.categoryButtonActive,
                    { backgroundColor: selectedCategory === category.name ? category.color : '#F0F0F0' }
                  ]}
                  onPress={() => setSelectedCategory(category.name)}
                >
                  <Ionicons
                    name={category.icon as any}
                    size={24}
                    color={selectedCategory === category.name ? 'white' : '#666'}
                  />
                  <Text style={[
                    styles.categoryButtonText,
                    { color: selectedCategory === category.name ? 'white' : '#666' }
                  ]}>
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Date</Text>
          <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
            <Text style={styles.dateButtonText}>{date.toDateString()}</Text>
            <Ionicons name="calendar-outline" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}

        <TouchableOpacity style={styles.submitButton} onPress={handleAddExpense}>
          <Text style={styles.submitButtonText}>Add Transaction</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    backgroundColor: '#667eea',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  formContainer: {
    padding: 20,
  },
  typeSelector: {
    flexDirection: 'row',
    marginBottom: 20,
    borderRadius: 25,
    backgroundColor: '#F0F0F0',
    padding: 5,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 20,
  },
  typeButtonActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  categoryContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  categoryButton: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 10,
    borderRadius: 15,
    minWidth: 80,
  },
  categoryButtonActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryButtonText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  dateButton: {
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#667eea',
    borderRadius: 15,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddExpenseScreen;
