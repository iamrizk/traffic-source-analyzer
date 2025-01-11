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
    padding: 30,
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  section: {
    marginBottom: 15,
  },
  title: {
    fontSize: 16,
    marginBottom: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1a365d',
  },
  subtitle: {
    fontSize: 12,
    marginBottom: 8,
    marginTop: 10,
    fontWeight: 'bold',
    color: '#2d3748',
    backgroundColor: '#f7fafc',
    padding: 4,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 4,
    alignItems: 'flex-start',
  },
  label: {
    width: 100,
    fontWeight: 'bold',
    color: '#4a5568',
  },
  value: {
    flex: 1,
    paddingRight: 10,
  },
  parameter: {
    marginBottom: 3,
    fontSize: 9,
  },
  ruleMatch: {
    marginBottom: 8,
    padding: 4,
    backgroundColor: '#f7fafc',
  },
  noMatches: {
    color: '#718096',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 10,
  },
  divider: {
    borderBottom: 1,
    borderBottomColor: '#e2e8f0',
    marginVertical: 8,
  },
});

const AnalysisPDF = ({ url, referralSource, matches, parameters }: AnalysisPDFProps) => {
  const uniqueTypes = [...new Set(matches.map(match => match.output.type).filter(Boolean))];
  const uniquePlatforms = [...new Set(matches.map(match => match.output.platform).filter(Boolean))];
  const uniqueChannels = [...new Set(matches.map(match => match.output.channel).filter(Boolean))];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>URL Analysis Report</Text>
          
          <View style={styles.row}>
            <Text style={styles.label}>URL:</Text>
            <Text style={styles.value}>{url}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Referral:</Text>
            <Text style={styles.value}>{referralSource || 'None'}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {matches.length > 0 ? (
          <>
            <View style={styles.section}>
              <Text style={styles.subtitle}>Consolidated Summary</Text>
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

            <View style={styles.divider} />

            <View style={styles.section}>
              <Text style={styles.subtitle}>Matched Rules</Text>
              {matches.map((match, index) => (
                <View key={index} style={styles.ruleMatch}>
                  <Text>Rule #{match.ruleIndex + 1}: {match.ruleName}</Text>
                  <Text style={styles.value}>
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
          <>
            <View style={styles.divider} />
            <View style={styles.section}>
              <Text style={styles.subtitle}>Parameters</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {Object.entries(parameters).map(([key, value], index) => (
                  <View key={index} style={[styles.parameter, { width: '50%' }]}>
                    <Text>{key}: {value}</Text>
                  </View>
                ))}
              </View>
            </View>
          </>
        )}
      </Page>
    </Document>
  );
};

export default AnalysisPDF;