// transactionExample.js
const pool = require('./db');

async function doTransaction() {
  let conn;
  const studentId = 'S10811005';
  const newDepartmentId = 'EE001';

  try {
    conn = await pool.getConnection();

    // 新增：先檢查學號是否存在
    const [checkRows] = await conn.query(
      'SELECT Department_ID FROM STUDENT WHERE Student_ID = ?',
      [studentId]
    );

    if (checkRows.length === 0) {
      console.error('錯誤：查無此學號，交易中止');
      return; // 直接終止程式，不執行下方交易
    }

    await conn.beginTransaction(); // 原本的交易開始

    // 原本的更新邏輯
    const updateStudent = 'UPDATE STUDENT SET Department_ID = ? WHERE Student_ID = ?';
    await conn.query(updateStudent, [newDepartmentId, studentId]);

    await conn.commit(); // 原本的提交
    console.log('交易成功，已提交');

    // 新增：查詢並印出該學生目前的系所名稱
    const result = await conn.query(
        `SELECT S.Student_ID, D.Name AS Department_Name
         FROM STUDENT S
         JOIN DEPARTMENT D ON S.Department_ID = D.Department_ID
         WHERE S.Student_ID = ?`,
        [studentId]
      );
      console.log('回傳結果 result:', result);
      // result 是一個陣列：[ rows, fields ]
      const resultRows = result;
      
      if (resultRows.length > 0) {
        console.log(`學生 ${resultRows[0].Student_ID} 目前在 ${resultRows[0].Department_Name} 系`);
      } else {
        console.log('找不到學生的系所資訊。');
      }
      

  } catch (err) {
    if (conn) await conn.rollback(); // 原本的錯誤處理
    console.error('交易失敗，已回滾：', err);
  } finally {
    if (conn) conn.release(); // 原本的連線釋放
  }
}

doTransaction();
