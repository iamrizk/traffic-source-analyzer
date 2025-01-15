import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { styles } from './styles';

interface ParametersTableProps {
  parameters: Record<string, string>;
}

export const ParametersTable: React.FC<ParametersTableProps> = ({ parameters }) => {
  return (
    <View style={styles.table}>
      <View style={styles.tableHeader}>
        <Text style={styles.tableHeaderCell}>Parameter</Text>
        <Text style={styles.tableHeaderCell}>Value</Text>
      </View>
      {Object.entries(parameters).map(([key, value], index) => (
        <View key={index} style={[styles.tableRow, index % 2 === 0 && { backgroundColor: '#f1f5f9' }]}>
          <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>{key}</Text>
          <Text style={styles.tableCell}>{value}</Text>
        </View>
      ))}
    </View>
  );
};