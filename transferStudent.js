const { sequelize, Student, Course, Enrollment } = require('./models');

async function transferStudent(studentId, oldDeptId, newDeptId) {
  const t = await sequelize.transaction();
  try {
    // 1. 更新學生的系所
    await Student.update(
      { Department_ID: newDeptId },
      { where: { Student_ID: studentId }, transaction: t }
    );

    // 2. 標記舊系所的必修課程為「轉系退選」
    const oldRequiredCourses = await Course.findAll({
      where: {
        Department_ID: oldDeptId,
      },
      transaction: t
    });

    const oldCourseIds = oldRequiredCourses.map(c => c.Course_ID);

    await Enrollment.update(
      { Status: '轉系退選' },
      {
        where: {
          Student_ID: studentId,
          Course_ID: oldCourseIds
        },
        transaction: t
      }
    );

    // 3. 加選新系所的必修課程
    const newRequiredCourses = await Course.findAll({
      where: {
        Department_ID: newDeptId,
      },
      transaction: t
    });

    const currentSemester = '112-2'; // 可改成變數或參數

    for (const course of newRequiredCourses) {
      await Enrollment.create({
        Student_ID: studentId,
        Course_ID: course.Course_ID,
        Semester_ID: currentSemester,
        Enrollment_Date: new Date(),
        Status: '轉系加選'
      }, { transaction: t });
    }

    await t.commit();
    console.log(`學生 ${studentId} 已從 ${oldDeptId} 轉到 ${newDeptId}`);
  } catch (err) {
    await t.rollback();
    console.error('轉系處理失敗：', err);
  }
}

// 測試呼叫
transferStudent('S10811005', 'CS001', 'EE001');
