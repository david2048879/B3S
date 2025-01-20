const Comment = () => {
    return ( 
        <div class="container mt-5">
        <div class="card">
            <div class="card-header bg-light">
                <h5 class="card-title mb-0">Comments on Position-Specific Objectives (Optional)</h5>
            </div>
            <div class="card-body">
                    <div class="mb-4">
                        <label for="employeeComments" class="form-label fw-bold">Employee</label>
                        <textarea class="form-control" id="employeeComments" rows="4" placeholder="Enter comments here..."></textarea>
                    </div>
                    <div class="mb-4">
                        <label for="supervisorComments" class="form-label fw-bold">Supervisor</label>
                        <textarea class="form-control" id="supervisorComments" rows="4" placeholder="Enter comments here..."></textarea>
                    </div>
            </div>
        </div>
    </div>
     );
}
 
export default Comment;