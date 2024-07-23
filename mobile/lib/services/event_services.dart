import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:poosd/models/event.dart';
import 'package:http/http.dart' as http;
import 'package:poosd/providers/event_provider.dart';
import 'package:poosd/providers/user_provider.dart';
import 'package:poosd/utils/constants.dart';
import 'package:poosd/utils/utils.dart';
import 'package:provider/provider.dart';

class EventServices {

  late String userEyeDee;

  void setId(String s) {
    userEyeDee = s;
  }

  void apiAddEvent({
    required BuildContext context,
    required String name,
    required DateTime endDate,
    required DateTime startDate,

  }) async {
    try {
      
      final user = Provider.of<UserProvider>(context, listen: false).user;
      Event event = Event(title: name, from: startDate, to: endDate, eventId: "", userEyeD: user.getId());
      
      http.Response res = await http.post(
        Uri.parse('${Constants.uri}/api/addEvent'),
        body: event.toJson(),
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
        },
      );

      httpErrorHandle(
        response: res, 
        // ignore: use_build_context_synchronously
        context: context, 
        onSuccess: () {
          // showSnackBar(context, 'Event added!',);
          //showSnackBar(context, res.toString(),);
          
          var responseData = json.decode(res.body);
          String ret = responseData["id"].toString();
          event.setEventId(ret);

          //showSnackBar(context, 'Event added!',);
        },
      );

    } catch (e) {
      // ignore: use_build_context_synchronously
      showSnackBar(context, e.toString());
    }
  }

  void apiEditEvent({
    required BuildContext context,
    required String name,
    required DateTime endDate,
    required DateTime startDate,
    required String id,
  }) async {
    try {

      final user = Provider.of<UserProvider>(context, listen: false).user;
      Event event = Event(title: name, from: startDate, to: endDate, eventId: id, userEyeD: user.getId().toString());
      
      http.Response res = await http.post(
        Uri.parse('${Constants.uri}/api/updateEvent'),
        body: event.toJson(),
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
        },
      );

      httpErrorHandle(
        response: res, 
        // ignore: use_build_context_synchronously
        context: context, 
        onSuccess: () {
          showSnackBar(context, res.toString(),);
          showSnackBar(context, 'Event edited!',);
        },
      );

    } catch (e) {
      // ignore: use_build_context_synchronously
      showSnackBar(context, e.toString());
    }
  }

  void apiRemoveEvent({
    required BuildContext context,
    required String eventId,

  }) async {
    try {
      //Event event = Event(title: name, from: startDate, to: endDate);
      http.Response res = await http.post(
        Uri.parse('${Constants.uri}/api/deleteEvent'),
        body: jsonEncode({
          'id': eventId
        }),
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
        },
      );

      
      httpErrorHandle(
        response: res, 
        // ignore: use_build_context_synchronously
        context: context, 
        onSuccess: () {
          //showSnackBar(context, res.toString(),);
          showSnackBar(context, 'Event deleted!',);
        },
      );

    } catch (e) {
      // ignore: use_build_context_synchronously
      showSnackBar(context, e.toString());
    }
  }

  void apiGetEvents({
    required BuildContext context,
    required String theId,
  }) async {
    try {
      //Event event = Event(title: name, from: startDate, to: endDate);
      final provider = Provider.of<EventProvider>(context, listen: false);
      //final user = Provider.of<UserProvider>(context, listen: false).user;

      final response = await http.post(
        Uri.parse('${Constants.uri}/api/searchEvent'),
        body: jsonEncode({
          'name': '',
        }),
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
        },
        
      );

      var responseData = json.decode(response.body);

      final inspect = responseData['events'];

      for (var singleEvent in inspect) {

        if (singleEvent != null) {

          String usedId = singleEvent["UserId"].toString();

          if (usedId != theId) continue;

          String toDateString = singleEvent["EndDate"].toString();
          String fromDateString = singleEvent["StartDate"].toString();

          if (toDateString == 'null' || toDateString.isEmpty || 
          toDateString.contains(',') || toDateString.contains('/')) continue;

          if (fromDateString == 'null' || fromDateString.isEmpty || 
          fromDateString.contains(',') || fromDateString.contains('/')) continue;

          DateFormat format = DateFormat("MM-dd-yyyy-HH-mm-ss");

          DateTime toFormat = format.parse(toDateString);
          DateTime fromFormat = format.parse(fromDateString);

          String title = singleEvent["Name"].toString();
          String eventd = singleEvent["_id"].toString();
          
          Event event = Event(
            title: title, 
            from: toFormat, 
            to: fromFormat, 
            eventId: eventd, 
            backgroundColor: Colors.blue, 
            userEyeD: '',
          );

          provider.addEvent(event);
        }
      }

    } catch (e) {
      // ignore: use_build_context_synchronously
      showSnackBar(context, e.toString());
    }
  }
}