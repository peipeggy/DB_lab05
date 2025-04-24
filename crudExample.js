// crudExample.js
const pool = require('./db');

async function basicCrud() {
  let conn;
  try {
    conn = await pool.getConnection();
    
    
    
    // 3. UPDATE 更新
    sql = 'UPDATE STUDENT SET Name = ? WHERE Student_ID = ?';
    const result = await conn.query(sql, ['王小明', 'S10810001']); // 移除解構，確保 result 取得正確格式

    // 判斷是否更新成功
    if (result.affectedRows > 0) {
      console.log('已更新學生名稱');
    } else {
      console.log('更新失敗：找不到該學號');
    }
  } catch (err) {
    console.error('操作失敗：', err);
  } finally {
    if (conn) conn.release();
  }

  
  
}

basicCrud();
