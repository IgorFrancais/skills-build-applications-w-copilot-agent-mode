from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from djongo import models
from octofit_tracker import settings
from django.conf import settings as django_settings

from pymongo import MongoClient

class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **options):
        # Connect to MongoDB
        client = MongoClient('localhost', 27017)
        db = client['octofit_db']

        # Drop collections if they exist
        db.users.drop()
        db.teams.drop()
        db.activities.drop()
        db.leaderboard.drop()
        db.workouts.drop()

        # Create unique index on email for users
        db.users.create_index('email', unique=True)

        # Sample users (superheroes)
        users = [
            {"name": "Bruce Wayne", "email": "batman@dc.com", "team": "DC"},
            {"name": "Clark Kent", "email": "superman@dc.com", "team": "DC"},
            {"name": "Diana Prince", "email": "wonderwoman@dc.com", "team": "DC"},
            {"name": "Tony Stark", "email": "ironman@marvel.com", "team": "Marvel"},
            {"name": "Steve Rogers", "email": "captain@marvel.com", "team": "Marvel"},
            {"name": "Natasha Romanoff", "email": "blackwidow@marvel.com", "team": "Marvel"},
        ]
        db.users.insert_many(users)

        # Teams
        teams = [
            {"name": "Marvel", "members": ["Tony Stark", "Steve Rogers", "Natasha Romanoff"]},
            {"name": "DC", "members": ["Bruce Wayne", "Clark Kent", "Diana Prince"]},
        ]
        db.teams.insert_many(teams)

        # Activities
        activities = [
            {"user": "Bruce Wayne", "activity": "Running", "duration": 30},
            {"user": "Clark Kent", "activity": "Flying", "duration": 60},
            {"user": "Diana Prince", "activity": "Weightlifting", "duration": 45},
            {"user": "Tony Stark", "activity": "Cycling", "duration": 25},
            {"user": "Steve Rogers", "activity": "Swimming", "duration": 35},
            {"user": "Natasha Romanoff", "activity": "Martial Arts", "duration": 40},
        ]
        db.activities.insert_many(activities)

        # Leaderboard
        leaderboard = [
            {"team": "Marvel", "points": 100},
            {"team": "DC", "points": 90},
        ]
        db.leaderboard.insert_many(leaderboard)

        # Workouts
        workouts = [
            {"user": "Bruce Wayne", "workout": "Pushups", "reps": 100},
            {"user": "Clark Kent", "workout": "Bench Press", "reps": 200},
            {"user": "Diana Prince", "workout": "Deadlift", "reps": 150},
            {"user": "Tony Stark", "workout": "Squats", "reps": 120},
            {"user": "Steve Rogers", "workout": "Pullups", "reps": 80},
            {"user": "Natasha Romanoff", "workout": "Situps", "reps": 110},
        ]
        db.workouts.insert_many(workouts)

        self.stdout.write(self.style.SUCCESS('octofit_db database populated with test data.'))
