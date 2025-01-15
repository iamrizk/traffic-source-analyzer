import { StyleSheet } from '@react-pdf/renderer';

export const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 8,
    color: '#6E59A5',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 15,
    color: '#6E59A5',
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 15,
  },
  text: {
    fontSize: 10,
    marginBottom: 5,
    flex: 1,
    color: '#222222',
  },
  ruleMatch: {
    marginBottom: 10,
    padding: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 4,
  },
  ruleTitle: {
    fontSize: 12,
    color: '#6E59A5',
    marginBottom: 5,
    fontWeight: 'bold',
  },
  matchDetail: {
    fontSize: 9,
    marginBottom: 2,
    color: '#4A5568',
  },
  outputSection: {
    marginTop: 5,
    padding: 4,
    backgroundColor: '#ffffff',
    borderRadius: 2,
  },
  outputLabel: {
    color: '#6E59A5',
    fontWeight: 'bold',
    fontSize: 9,
  },
  outputValue: {
    color: '#222222',
    fontSize: 9,
  },
  noMatches: {
    fontSize: 12,
    color: '#EAB308',
    backgroundColor: '#FEF9C3',
    padding: 10,
    borderRadius: 4,
  },
  table: {
    width: '100%',
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#9b87f5',
    padding: 8,
    marginBottom: 1,
  },
  tableHeaderCell: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
    width: '50%',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: 1,
    borderBottomColor: '#e2e8f0',
    backgroundColor: '#f8f9fa',
    minHeight: 30,
  },
  tableCell: {
    padding: 8,
    fontSize: 10,
    width: '50%',
    color: '#4A5568',
  },
  pageTitle: {
    fontSize: 18,
    color: '#6E59A5',
    marginBottom: 15,
    fontWeight: 'bold',
  },
});