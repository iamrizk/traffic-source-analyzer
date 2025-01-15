import React from 'react';
import { Document, Page, Text, View } from '@react-pdf/renderer';
import { RuleMatch } from '@/types/analyzer';
import { styles } from './styles';
import { RuleMatches } from './pdf/RuleMatches';
import { ParametersTable } from './pdf/ParametersTable';

interface AnalysisPDFProps {
  url: string;
  referrer: string | null;
  matches: RuleMatch[];
  parameters: Record<string, string>;
}

export const AnalysisPDF: React.FC<AnalysisPDFProps> = ({
  url,
  referrer,
  matches,
  parameters,
}) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>URL Analysis Report</Text>
          <Text style={styles.text}>URL: {url}</Text>
          {referrer && <Text style={styles.text}>Referrer: {referrer}</Text>}
        </View>

        <View style={styles.section}>
          <Text style={styles.subtitle}>Matched Rules</Text>
          <RuleMatches matches={matches} />
        </View>
      </Page>

      {Object.keys(parameters).length > 0 && (
        <Page size="A4" style={styles.page}>
          <Text style={styles.pageTitle}>URL Parameters Analysis</Text>
          <ParametersTable parameters={parameters} />
        </Page>
      )}
    </Document>
  );
};