export const envs = {
    baseURL: import.meta.env.VITE_HOST_BACKEND || 'http://localhost:8080',
    loginPath: import.meta.env.VITE_LOGIN_PATH || '/api/v1/user/login',
    registerPath: import.meta.env.VITE_REGISTER_PATH || '/api/v1/user/register',
    userPath: import.meta.env.VITE_USER_PATH || '/api/v1/user',
    habitPath: import.meta.env.VITE_HABIT_PATH || '/api/v1/habit',
    habitWeekPath: import.meta.env.VITE_HABIT_WEEK_PATH || '/api/v1/habit/week',
    progressPath: import.meta.env.VITE_PROGRESS_PATH || '/api/v1/progress',
    reportPath: import.meta.env.VITE_REPORT_PATH || '/api/v1/report',
    achievementPath: import.meta.env.VITE_ACHIEVEMENT_PATH || '/api/v1/userAchievement/achievements',
};
