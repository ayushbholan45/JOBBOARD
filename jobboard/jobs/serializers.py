from rest_framework import serializers
from .models import Job, Category

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']

class JobSerializer(serializers.ModelSerializer):
    employer_name = serializers.SerializerMethodField()
    category_name = serializers.SerializerMethodField()

    class Meta:
        model = Job
        fields = [
            'id', 'title', 'description', 'location',
            'salary', 'is_active', 'created_at',
            'employer', 'employer_name',
            'category', 'category_name'
        ]
        read_only_fields = ['employer', 'created_at']

    def get_employer_name(self, obj):
        return obj.employer.username

    def get_category_name(self, obj):
        return obj.category.name if obj.category else None