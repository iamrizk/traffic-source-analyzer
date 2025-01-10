import { Document, Page, Text, View, StyleSheet, PDFViewer } from "@react-pdf/renderer";
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
    fontSize: 12,
  },
  section: {
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 5,
    marginTop: 10,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    width: 120,
    fontWeight: 'bold',
  },
  value: {
    flex: 1,
  },
  parameter: {
    marginBottom: 3,
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
            <Text style={styles.label}>Referral Source:</Text>
            <Text style={styles.value}>{referralSource || 'None'}</Text>
          </View>
        </View>

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

            <View style={styles.section}>
              <Text style={styles.subtitle}>Matched Rules</Text>
              {matches.map((match, index) => (
                <View key={index} style={styles.section}>
                  <Text>Rule #{match.ruleIndex + 1}: {match.ruleName}</Text>
                  <Text>Output: {match.output.type} / {match.output.platform} / {match.output.channel}</Text>
                </View>
              ))}
            </View>
          </>
        ) : (
          <View style={styles.section}>
            <Text>No rules matched the analyzed URL.</Text>
          </View>
        )}

        {Object.keys(parameters).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.subtitle}>Parameters</Text>
            {Object.entries(parameters).map(([key, value], index) => (
              <View key={index} style={styles.parameter}>
                <Text>{key}: {value}</Text>
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
};

export default AnalysisPDF;