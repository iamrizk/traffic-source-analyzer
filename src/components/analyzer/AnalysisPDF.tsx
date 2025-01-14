import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { RuleMatch } from "@/types/analyzer";

interface AnalysisPDFProps {
  url: string;
  referralSource: string;
  matches: RuleMatch[];
  parameters: Record<string, string>;
}

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  header: {
    backgroundColor: '#9b87f5',
    padding: 20,
    marginBottom: 20,
    borderRadius: 4,
  },
  headerText: {
    color: '#ffffff',
    fontSize: 24,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 20,
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 4,
  },
  title: {
    fontSize: 16,
    marginBottom: 10,
    color: '#1A1F2C',
    backgroundColor: '#D6BCFA',
    padding: 8,
    borderRadius: 4,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 8,
    color: '#6E59A5',
    borderBottom: 1,
    borderBottomColor: '#e2e8f0',
    paddingBottom: 4,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 6,
    alignItems: 'flex-start',
  },
  label: {
    width: 100,
    fontWeight: 'bold',
    color: '#7E69AB',
  },
  value: {
    flex: 1,
    color: '#222222',
  },
  parameter: {
    marginBottom: 4,
    fontSize: 9,
    backgroundColor: '#f1f1f1',
    padding: 4,
    borderRadius: 2,
  },
  ruleMatch: {
    marginBottom: 10,
    padding: 8,
    backgroundColor: '#f7fafc',
    borderLeft: 2,
    borderLeftColor: '#9b87f5',
  },
  noMatches: {
    color: '#8E9196',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 10,
  },
  divider: {
    borderBottom: 1,
    borderBottomColor: '#e2e8f0',
    marginVertical: 10,
  },
  summaryBox: {
    backgroundColor: '#f3f3f3',
    padding: 10,
    borderRadius: 4,
    marginBottom: 15,
  },
  summaryItem: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  summaryLabel: {
    width: 80,
    color: '#6E59A5',
    fontSize: 9,
  },
  summaryValue: {
    flex: 1,
    color: '#222222',
    fontSize: 9,
  },
  parametersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});

const AnalysisPDF = ({ url, referralSource, matches, parameters }: AnalysisPDFProps) => {
  const uniqueTypes = [...new Set(matches.map(match => match.output.type).filter(Boolean))];
  const uniquePlatforms = [...new Set(matches.map(match => match.output.platform).filter(Boolean))];
  const uniqueChannels = [...new Set(matches.map(match => match.output.channel).filter(Boolean))];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerText}>URL Analysis Report</Text>
        </View>

        <View style={styles.summaryBox}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>URL:</Text>
            <Text style={styles.summaryValue}>{url}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Referral:</Text>
            <Text style={styles.summaryValue}>{referralSource || 'None'}</Text>
          </View>
        </View>

        {matches.length > 0 ? (
          <>
            <View style={styles.section}>
              <Text style={styles.subtitle}>Analysis Overview</Text>
              {uniqueTypes.length > 0 && (
                <View style={styles.row}>
                  <Text style={styles.label}>Visit Nature:</Text>
                  <Text style={styles.value}>{uniqueTypes.join(', ')}</Text>
                </View>
              )}
              {uniquePlatforms.length > 0 && (
                <View style={styles.row}>
                  <Text style={styles.label}>Platforms:</Text>
                  <Text style={styles.value}>{uniquePlatforms.join(', ')}</Text>
                </View>
              )}
              {uniqueChannels.length > 0 && (
                <View style={styles.row}>
                  <Text style={styles.label}>Channels:</Text>
                  <Text style={styles.value}>{uniqueChannels.join(', ')}</Text>
                </View>
              )}
            </View>

            <View style={styles.section}>
              <Text style={styles.subtitle}>Matched Rules</Text>
              {matches.map((match, index) => (
                <View key={index} style={styles.ruleMatch}>
                  <Text style={{ color: '#6E59A5', fontWeight: 'bold', marginBottom: 4 }}>
                    Rule #{match.ruleIndex + 1}: {match.ruleName}
                  </Text>
                  <Text style={{ color: '#555555', fontSize: 9 }}>
                    {match.output.type && `Type: ${match.output.type}`}
                    {match.output.platform && ` • Platform: ${match.output.platform}`}
                    {match.output.channel && ` • Channel: ${match.output.channel}`}
                  </Text>
                </View>
              ))}
            </View>
          </>
        ) : (
          <View style={styles.section}>
            <Text style={styles.noMatches}>No rules matched the analyzed URL.</Text>
          </View>
        )}

        {Object.keys(parameters).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.subtitle}>URL Parameters</Text>
            <View style={styles.parametersGrid}>
              {Object.entries(parameters).map(([key, value], index) => (
                <View key={index} style={[styles.parameter, { width: '48%' }]}>
                  <Text style={{ color: '#555555' }}>
                    <Text style={{ color: '#7E69AB', fontWeight: 'bold' }}>{key}:</Text> {value}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
};

export default AnalysisPDF;