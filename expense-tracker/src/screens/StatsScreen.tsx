import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useSelector } from 'react-redux';
import { PieChart, LineChart } from 'react-native-chart-kit';
import { RootState } from '../store/store';

const screenWidth = Dimensions.get('window').width;

const StatsScreen: React.FC = () => {
  const { expenses, categories } = useSelector((state: RootState) => state.expenses);

  const chartConfig = {
    backgroundColor: '#667eea',
    backgroundGradientFrom: '#667eea',
    backgroundGradientTo: '#764ba2',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#ffa726',
    },
  };

  const expensesByCategory = useMemo(() => {
    const categoryTotals: { [key: string]: number } = {};
    
    expenses
      .filter(expense => expense.type === 'expense')
      .forEach(expense => {
        categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
      });

    return Object.entries(categoryTotals).map(([category, amount]) => {
      const categoryInfo = categories.find(cat => cat.name === category);
      return {
        name: category,
        amount,
        color: categoryInfo?.color || '#007AFF',
        legendFontColor: '#333',
        legendFontSize: 12,
      };
    });
  }, [expenses, categories]);

  const monthlyData = useMemo(() => {
    const last6Months = [];
    const currentDate = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthName = date.toLocaleString('default', { month: 'short' });
      
      const monthExpenses = expenses
        .filter(expense => {
          const expenseDate = new Date(expense.date);
          return expenseDate.getMonth() === date.getMonth() && 
                 expenseDate.getFullYear() === date.getFullYear() &&
                 expense.type === 'expense';
        })
        .reduce((sum, expense) => sum + expense.amount, 0);
        
      last6Months.push({
        month: monthName,
        amount: monthExpenses,
      });
    }
    
    return {
      labels: last6Months.map(item => item.month),
      datasets: [{
        data: last6Months.map(item => item.amount),
      }],
    };
  }, [expenses]);

  const totalExpenses = expenses
    .filter(expense => expense.type === 'expense')
    .reduce((sum, expense) => sum + expense.amount, 0);

  const totalIncome = expenses
    .filter(expense => expense.type === 'income')
    .reduce((sum, expense) => sum + expense.amount, 0);

  const currentMonthExpenses = expenses
    .filter(expense => {
      const expenseDate = new Date(expense.date);
      const currentDate = new Date();
      return expenseDate.getMonth() === currentDate.getMonth() &&
             expenseDate.getFullYear() === currentDate.getFullYear() &&
             expense.type === 'expense';
    })
    .reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Statistics</Text>
        <Text style={styles.headerSubtitle}>Your spending insights</Text>
      </View>

      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total Income</Text>
          <Text style={[styles.summaryAmount, { color: '#4CAF50' }]}>
            ${totalIncome.toFixed(2)}
          </Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total Expenses</Text>
          <Text style={[styles.summaryAmount, { color: '#F44336' }]}>
            ${totalExpenses.toFixed(2)}
          </Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>This Month</Text>
          <Text style={[styles.summaryAmount, { color: '#FF9800' }]}>
            ${currentMonthExpenses.toFixed(2)}
          </Text>
        </View>
      </View>

      {expensesByCategory.length > 0 && (
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Expenses by Category</Text>
          <PieChart
            data={expensesByCategory}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            accessor="amount"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        </View>
      )}

      {monthlyData.datasets[0].data.some(value => value > 0) && (
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Monthly Expenses Trend</Text>
          <LineChart
            data={monthlyData}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </View>
      )}

      {expensesByCategory.length === 0 && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No data to display</Text>
          <Text style={styles.emptySubtext}>Add some expenses to see your statistics</Text>
        </View>
      )}
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
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  summaryCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  summaryAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  chartContainer: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  chart: {
    borderRadius: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
});

export default StatsScreen;
