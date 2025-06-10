import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useApp } from '../context/AppContext';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundaryClass extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can log the error to an error reporting service here
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View style={styles.container}>
          <Text style={styles.title}>Oops! Something went wrong</Text>
          <Text style={styles.message}>
            {this.state.error?.message || 'An unexpected error occurred'}
          </Text>
          <Button
            mode="contained"
            onPress={() => this.setState({ hasError: false, error: null })}
            style={styles.button}
          >
            Try Again
          </Button>
        </View>
      );
    }

    return this.props.children;
  }
}

// Wrap the class component with a functional component to use hooks
export const ErrorBoundary: React.FC<Props> = (props) => {
  const { groupsError, userError } = useApp();
  const error = groupsError || userError;

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Error</Text>
        <Text style={styles.message}>{error}</Text>
        <Button
          mode="contained"
          onPress={() => window.location.reload()}
          style={styles.button}
        >
          Reload App
        </Button>
      </View>
    );
  }

  return <ErrorBoundaryClass {...props} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  button: {
    minWidth: 200,
  },
}); 