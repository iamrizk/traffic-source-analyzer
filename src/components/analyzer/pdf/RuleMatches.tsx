import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { styles } from './styles';
import { RuleMatch } from '@/types/analyzer';

interface RuleMatchesProps {
  matches: RuleMatch[];
}

export const RuleMatches: React.FC<RuleMatchesProps> = ({ matches }) => {
  if (matches.length === 0) {
    return <Text style={styles.noMatches}>No rules matched the analyzed URL.</Text>;
  }

  return (
    <>
      {matches.map((match, index) => (
        <View key={index} style={styles.ruleMatch}>
          <Text style={styles.ruleTitle}>
            Matched Rule #{match.ruleIndex + 1}: {match.ruleName}
          </Text>
          {match.matchDetails.map((detail, detailIndex) => (
            <Text key={detailIndex} style={styles.matchDetail}>
              • {detail}
            </Text>
          ))}
          <View style={styles.outputSection}>
            {match.output.type && (
              <Text style={styles.text}>
                <Text style={styles.outputLabel}>Visit nature: </Text>
                <Text style={styles.outputValue}>{match.output.type}</Text>
              </Text>
            )}
            {match.output.platform && (
              <Text style={styles.text}>
                <Text style={styles.outputLabel}>Platform: </Text>
                <Text style={styles.outputValue}>{match.output.platform}</Text>
              </Text>
            )}
            {match.output.channel && (
              <Text style={styles.text}>
                <Text style={styles.outputLabel}>Channel: </Text>
                <Text style={styles.outputValue}>{match.output.channel}</Text>
              </Text>
            )}
          </View>
        </View>
      ))}
    </>
  );
};