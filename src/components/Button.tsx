import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { theme } from '../theme/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  type?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ title, onPress, type = 'primary' }) => {
  const buttonStyle = type === 'primary' ? styles.primaryButton : styles.secondaryButton;
  const textStyle = type === 'primary' ? styles.primaryText : styles.secondaryText;

  return (
    <TouchableOpacity style={[styles.button, buttonStyle]} onPress={onPress}>
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: theme.spacing.medium,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
  },
  secondaryButton: {
    backgroundColor: theme.colors.secondary,
  },
  text: {
    fontSize: theme.typography.fontSize.medium,
    fontFamily: theme.typography.fontFamily.medium,
  },
  primaryText: {
    color: theme.colors.surface,
  },
  secondaryText: {
    color: theme.colors.text,
  },
});

export default Button; 