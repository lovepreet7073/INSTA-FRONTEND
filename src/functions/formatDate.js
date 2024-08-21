import moment from 'moment';

const formatShortDate = (date) => {
    if (!date) {
        return "weeks ago"; // Default message if no date is provided
    }

    const now = moment();
    const then = moment(date);
    const duration = moment.duration(now.diff(then));

    if (duration.asSeconds() < 60) {
        return `${Math.floor(duration.asSeconds())}s`; // Show seconds
    } else if (duration.asMinutes() < 60) {
        return `${Math.floor(duration.asMinutes())}m`; // Show minutes
    } else if (duration.asHours() < 24) {
        return `${Math.floor(duration.asHours())}h`; // Show hours
    } else if (duration.asDays() < 7) {
        return `${Math.floor(duration.asDays())}d`; // Show days
    } else if (duration.asDays() < 30) {
        return `${Math.floor(duration.asDays() / 7)}w`; // Show weeks
    } else if (duration.asDays() < 365) {
        return `${Math.floor(duration.asDays() / 30)}m`; // Show months
    } else {
        return `${Math.floor(duration.asDays() / 365)}y`; // Show years
    }
};

export default formatShortDate;
