import { useState } from "react";
import { View, Text, TextInput, StyleSheet, Button } from "react-native";
import { useAuth } from "../../context/AuthContext";

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { onLogin } = useAuth();

  const login = () => {
    if (onLogin) {
      onLogin(email, password);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Email:</Text>
      <TextInput
        autoCapitalize="none"
        autoComplete="email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
      />
      <Text style={styles.label}>Password:</Text>
      <TextInput
        secureTextEntry={true}
        autoCapitalize="none"
        autoComplete="password"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="********"
      />

      <View>
        <Button color="#2296F3" title="Login" onPress={login} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '80%',
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 6,
    borderColor: 'black',
    backgroundColor: 'white',
  },
  label: {
    width: '80%',
  },
  button: {
    backgroundColor: 'blue',
  }
});
