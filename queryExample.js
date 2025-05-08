const { Enrollment, Student, Course } = require('./models');

async function findUngraded() {
  try {
    const enrollments = await Enrollment.findAll({
      where: {
        Grade: null
      },
      include: [
        {
          model: Student,
          attributes: ['Student_ID', 'Name']
        },
        {
          model: Course,
          attributes: ['Course_ID', 'Title']
        }
      ]
    });

    console.log('未評分的選課記錄：');
    enrollments.forEach(e => {
      console.log(`學生：${e.Student.Name} (${e.Student.Student_ID}), 課程：${e.Course.Title} (${e.Course.Course_ID})`);
    });

    return enrollments;
  } catch (err) {
    console.error('查詢失敗：', err);
  }
}

findUngraded();
