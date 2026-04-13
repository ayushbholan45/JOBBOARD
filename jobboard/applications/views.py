from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import Application
from .serializers import ApplicationSerializer
from jobs.models import Job

class ApplyJobView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, job_id):
        # only candidates can apply
        if request.user.profile.role != 'candidate':
            return Response(
                {'error': 'Only candidates can apply for jobs'},
                status=status.HTTP_403_FORBIDDEN
            )

        # check job exists
        try:
            job = Job.objects.get(pk=job_id, is_active=True)
        except Job.DoesNotExist:
            return Response(
                {'error': 'Job not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        # check already applied
        if Application.objects.filter(job=job, candidate=request.user).exists():
            return Response(
                {'error': 'You have already applied for this job'},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = ApplicationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(job=job, candidate=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MyApplicationsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # candidate sees their own applications
        if request.user.profile.role != 'candidate':
            return Response(
                {'error': 'Only candidates can view applications'},
                status=status.HTTP_403_FORBIDDEN
            )
        applications = Application.objects.filter(candidate=request.user)
        serializer = ApplicationSerializer(applications, many=True)
        return Response(serializer.data)


class JobApplicantsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, job_id):
        # employer sees applicants for their job
        try:
            job = Job.objects.get(pk=job_id, employer=request.user)
        except Job.DoesNotExist:
            return Response(
                {'error': 'Job not found or not yours'},
                status=status.HTTP_404_NOT_FOUND
            )
        applications = Application.objects.filter(job=job)
        serializer = ApplicationSerializer(applications, many=True)
        return Response(serializer.data)


class UpdateApplicationStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            application = Application.objects.get(pk=pk)
        except Application.DoesNotExist:
            return Response(
                {'error': 'Application not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        # only the job's employer can update status
        if application.job.employer != request.user:
            return Response(
                {'error': 'Not authorized'},
                status=status.HTTP_403_FORBIDDEN
            )

        new_status = request.data.get('status')
        if new_status not in ['pending', 'accepted', 'rejected']:
            return Response(
                {'error': 'Invalid status'},
                status=status.HTTP_400_BAD_REQUEST
            )

        application.status = new_status
        application.save()
        serializer = ApplicationSerializer(application)
        return Response(serializer.data)