import 'package:flutter/material.dart';
import 'package:poosd/pages/eventeditor.dart';
import 'package:poosd/pages/forgot.dart';
import 'package:poosd/pages/home.dart';
import 'package:poosd/pages/login.dart';
import 'package:poosd/pages/signup.dart';
import 'package:poosd/pages/calendar.dart';
import 'package:poosd/providers/event_provider.dart';
import 'package:poosd/providers/user_provider.dart';

import 'package:provider/provider.dart';

void main() {
  runApp( 
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => UserProvider()),
      ],
      child: const MyApp(),
    )
  );
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (context) => EventProvider(),

      child: MaterialApp(
        debugShowCheckedModeBanner: false,
        home: const HomeFormScreen(),
        routes: {
          '/signup': (context) => const SignUpFormScreen(),
          '/login': (context) => const LoginFormScreen(),
          '/calendar': (context) => const CalendarFormScreen(),
          '/event': (context) => const EventEditingPage(),
          '/home': (context) => const HomeFormScreen(),
          '/forgot': (context) => const ForgotFormScreen()
        },
      ),
    );
  }
}

