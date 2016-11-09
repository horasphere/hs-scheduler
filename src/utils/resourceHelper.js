import {localDateFormat} from './date';
import moment from 'moment';

export const indexResources = (resources) => {
    const resourceById = {}
    const assignmentById = {}
    const assignmentIdsByResourceDate = {}

    resources.forEach((resource) => {
        const resourceId = resource.id;
        const assignmentIdsByDate = {};

        resource.assignments.forEach((assignment) => {
            const date = moment(assignment.start).format(localDateFormat);

            if(!assignmentIdsByDate[date]) {
                assignmentIdsByDate[date] = [];
            }

            assignmentById[assignment.id] = assignment;
            assignmentIdsByDate[date].push(assignment.id);
        })

        resourceById[resourceId] = resource;
        assignmentIdsByResourceDate[resourceId] = assignmentIdsByDate;
    })

    return {
        resourceById,
        assignmentById,
        assignmentIdsByResourceDate
    }
}

export const getAssignmentsByResourceAndDate = (resourceId, date, {resourceById, assignmentById, assignmentIdsByResourceDate}) => {
    const localDate = (typeof date === 'string') ? date : moment(date).format(localDateFormat);

    const assignmentsById = assignmentIdsByResourceDate[resourceId] || {};

    const assignmentIds = assignmentsById[localDate] || [];

    return assignmentIds.map((assignmentId) => {
        return assignmentById[assignmentId];
    })
}