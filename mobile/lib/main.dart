import 'package:flutter/material.dart'
import 'package:provider/provider.dart'
import 'services/api_service.dart'
import 'screens/home_screen.dart'

void main() {
  runApp(const TindurApp())
}

class TindurApp extends StatelessWidget {
  const TindurApp({Key? key}) : super(key: key)

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        Provider(create: (_) => ApiService()),
      ],
      child: MaterialApp(
        title: 'Tindur',
        theme: ThemeData(
          primaryColor: const Color(0xFF10b981), // Design system token
          useMaterial3: true,
          colorScheme: ColorScheme.fromSeed(
            seedColor: const Color(0xFF10b981),
          ),
        ),
        darkTheme: ThemeData(
          useMaterial3: true,
          colorScheme: ColorScheme.fromSeed(
            seedColor: const Color(0xFF10b981),
            brightness: Brightness.dark,
          ),
        ),
        themeMode: ThemeMode.system,
        home: const HomeScreen(),
      ),
    )
  }
}
