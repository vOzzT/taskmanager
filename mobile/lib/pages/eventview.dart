import 'package:flutter/material.dart';
import 'package:poosd/models/event.dart';
import 'package:poosd/pages/eventeditor.dart';
import 'package:poosd/providers/event_provider.dart';
import 'package:poosd/services/event_services.dart';
import 'package:poosd/utils/utils.dart';
import 'package:provider/provider.dart';

class EventViewingPage extends StatelessWidget {
  final Event event;

  final EventServices eventService = EventServices();
  
  EventViewingPage({
    super.key,
    required this.event,
  });

  @override
  Widget build(BuildContext context) => Scaffold(
    appBar: AppBar(
      leading: const CloseButton(),
      actions: buildViewActions(context, event),
    ),
    body: ListView(
      padding: const EdgeInsets.all(32),
      children: <Widget>[
        buildDateTime(event),
        const SizedBox(height: 32),
        Text(
          event.title,
          style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
        ),

      ],
    ),
  );

  Widget buildDateTime(Event event) {
    return Column(
      children: [
        buildDate('From', event.from),
        buildDate('To', event.to),
      ],
    );
  }

  Widget buildDate(String text, DateTime date) {
    return Row(
      children: [
        Text(
          text,
          style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
        ),

        const Spacer(),

        Text(
          Utils.toDateTime(date),
          textAlign: TextAlign.right,
        ),
      ],
    );
  }

  List<Widget> buildViewActions(BuildContext context, Event event) => [
    IconButton(
      icon: const Icon(Icons.edit),
      onPressed: () => Navigator.of(context).pushReplacement(
        MaterialPageRoute(
          builder: (context) => EventEditingPage(event: event),
        ),
      ),
    ),
    IconButton(
      icon: const Icon(Icons.delete),
      
      
      onPressed: () {

        showDialog(
          context: context, 
          builder: (context) => AlertDialog(
            title: Text(
              'Would you like to delete this event? \nMeeting: ${event.getTitle()}',
              style: const TextStyle(fontSize: 24),
            ),

            actions: [
              TextButton(
                onPressed: () => Navigator.of(context).pop(), 
                child: const Text("No"),
              ),
              TextButton(
                onPressed: () {
                  
                  final provider = Provider.of<EventProvider>(context, listen: false);
        
                  eventService.apiRemoveEvent(
                    context: context, 
                    eventId: event.eventId.toString()
                  );
                  provider.deleteEvent(event);

                  Navigator.pushNamed(context, '/calendar');

                }, 
                child: const Text("Yes"),
              ),
            ],

          )

        );
      },
    ),
  ];
  
}