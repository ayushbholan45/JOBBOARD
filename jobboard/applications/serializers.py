from rest_framework import serializers
from .models import Application

class ApplicationSerializer(serializers.ModelSerializer):
    candidate_name = serializers.SerializerMethodField()
    job_title = serializers.SerializerMethodField()

    class Meta:
        model = Application
        fields = [
            'id', 'job', 'job_title',
            'candidate', 'candidate_name',
            'resume', 'cover_letter',
            'status', 'applied_at'
        ]
        read_only_fields = ['candidate', 'status', 'applied_at', 'job']

    def get_candidate_name(self, obj):
        return obj.candidate.username

    def get_job_title(self, obj):
        return obj.job.title