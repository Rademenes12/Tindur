class Experience {
  final String id
  final String name
  final String description
  final double price
  final String currency
  final int duration
  final int maxParticipants
  final List<DateSlot> availableSlots

  Experience({
    required this.id,
    required this.name,
    required this.description,
    required this.price,
    required this.currency,
    required this.duration,
    required this.maxParticipants,
    required this.availableSlots,
  })

  factory Experience.fromJson(Map<String, dynamic> json) {
    return Experience(
      id: json['id'],
      name: json['name'],
      description: json['description'],
      price: json['price'].toDouble(),
      currency: json['currency'],
      duration: json['duration'],
      maxParticipants: json['maxParticipants'],
      availableSlots: (json['availableSlots'] as List)
          .map((slot) => DateSlot.fromJson(slot))
          .toList(),
    )
  }
}

class DateSlot {
  final String date
  final String time
  final int available

  DateSlot({
    required this.date,
    required this.time,
    required this.available,
  })

  factory DateSlot.fromJson(Map<String, dynamic> json) {
    return DateSlot(
      date: json['date'],
      time: json['time'],
      available: json['available'],
    )
  }
}
