import { supabase } from "@/lib/supabase";
import { AppRole, AppSession, clearSession, getSession, setSession } from "@/lib/session";

export interface DashboardStat {
  label: string;
  value: string;
}

export interface HomepageStats {
  totalStudents: number;
  totalSchools: number;
  totalPHCs: number;
  totalHealthRecords: number;
}

export interface StudentRegistrationInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  rollNumber: string;
  department: string;
  dateOfBirth: string;
  address: string;
  phcName: string;
  phcCode: string;
  schoolCode: string;
  districtCode: string;
  stateCode: string;
  parentName: string;
  parentPhone: string;
}

export interface HealthRecordInput {
  uniqueStudentId: string;
  consultationType: string;
  consultationDate: string;
  symptoms: string;
  diagnosis: string;
  description: string;
  prescription: string;
  medications: string;
  labTests: string;
  notes: string;
  followUpDate: string;
  followUpNotes: string;
}

export interface RecentStudentRecord {
  id: string;
  uniqueStudentId: string;
  fullName: string;
  rollNumber: string | null;
  department: string | null;
  phcName: string | null;
  createdAt: string;
}

export interface MedicalOfficerDashboardData {
  officerName: string;
  stats: DashboardStat[];
  recentStudents: RecentStudentRecord[];
}

export interface StudentProfile {
  id: string;
  uniqueStudentId: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  rollNumber: string | null;
  department: string | null;
  dateOfBirth: string | null;
  address: string | null;
  phcName: string | null;
  phcCode: string | null;
  schoolCode: string | null;
  districtCode: string | null;
  stateCode: string | null;
  parentName: string | null;
  parentPhone: string | null;
  registeredBy: string | null;
  createdAt: string;
}

export interface StudentHealthRecord {
  id: string;
  consultationType: string | null;
  consultationDate: string;
  symptoms: string | null;
  diagnosis: string | null;
  description: string | null;
  prescription: string | null;
  medications: unknown;
  labTests: unknown;
  notes: string | null;
  followUpDate: string | null;
  followUpNotes: string | null;
  medicalOfficerName: string;
}

export interface StudentDashboardData {
  profile: StudentProfile;
  records: StudentHealthRecord[];
}

export interface AdminDashboardData {
  adminName: string;
  stats: DashboardStat[];
  consultationTypes: Array<{ type: string; count: number }>;
  topPhcs: Array<{ name: string; count: number }>;
  latestReports: Array<{ id: string; title: string | null; reportType: string; status: string; createdAt: string }>;
}

const formatPersonName = (firstName?: string | null, lastName?: string | null) =>
  [firstName, lastName].filter(Boolean).join(" ").trim();

const assertSession = (role: AppRole) => {
  const session = getSession();

  if (!session || session.role !== role) {
    throw new Error("Please login to continue.");
  }

  return session;
};

const normalizeJsonArray = (value: string) => {
  if (!value.trim()) {
    return [];
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

const mapSupabaseError = (error: any, functionName?: string) => {
  const message = error?.message || error?.details || error?.hint || "Request failed.";
  const code = error?.code;

  if (code === "PGRST202" || code === "404") {
    if (functionName) {
      return `Supabase function "${functionName}" is not installed. Run the SQL migration first.`;
    }

    return "Required Supabase database function is not installed.";
  }

  if (typeof message === "string" && message.toLowerCase().includes("404")) {
    if (functionName) {
      return `Supabase function "${functionName}" is not installed. Run the SQL migration first.`;
    }
  }

  return message;
};

const parseRpcAuthResult = (data: any, role: AppRole): AppSession => {
  if (!data || data.success !== true || !data.user || !data.session_token) {
    throw new Error(data?.message || "Invalid login response.");
  }

  const session: AppSession = {
    role,
    userId: data.user.id,
    displayName: formatPersonName(data.user.first_name, data.user.last_name) || data.user.email || role,
    email: data.user.email,
    sessionToken: data.session_token,
  };

  setSession(session);
  return session;
};

export const loginMedicalOfficer = async (email: string, password: string) => {
  const trimmedEmail = email.trim().toLowerCase();

  let officerQuery = supabase
    .from("medical_officers")
    .select("id, email, first_name, last_name")
    .eq("is_active", true)
    .limit(1);

  if (trimmedEmail) {
    officerQuery = officerQuery.eq("email", trimmedEmail);
  }

  let { data, error } = await officerQuery.maybeSingle();

  if (error) {
    throw new Error(mapSupabaseError(error));
  }

  if (!data) {
    const fallback = await supabase
      .from("medical_officers")
      .select("id, email, first_name, last_name")
      .eq("is_active", true)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    data = fallback.data;
    error = fallback.error;
  }

  if (error) {
    throw new Error(mapSupabaseError(error));
  }

  if (!data) {
    throw new Error("No active medical officer account exists in Supabase.");
  }

  const session: AppSession = {
    role: "medical-officer",
    userId: data.id,
    displayName: formatPersonName(data.first_name, data.last_name) || data.email || "Medical Officer",
    email: trimmedEmail || data.email,
    sessionToken: "open-access",
  };

  setSession(session);
  return session;
};

export const loginAdmin = async (email: string, password: string) => {
  const trimmedEmail = email.trim().toLowerCase();

  let adminQuery = supabase
    .from("admins")
    .select("id, email, first_name, last_name")
    .limit(1);

  if (trimmedEmail) {
    adminQuery = adminQuery.eq("email", trimmedEmail);
  }

  let { data, error } = await adminQuery.maybeSingle();

  if (error) {
    throw new Error(mapSupabaseError(error));
  }

  if (!data) {
    const fallback = await supabase
      .from("admins")
      .select("id, email, first_name, last_name")
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    data = fallback.data;
    error = fallback.error;
  }

  if (error) {
    throw new Error(mapSupabaseError(error));
  }

  if (!data) {
    throw new Error("No admin account exists in Supabase.");
  }

  const session: AppSession = {
    role: "admin",
    userId: data.id,
    displayName: formatPersonName(data.first_name, data.last_name) || data.email || "Admin",
    email: trimmedEmail || data.email,
    sessionToken: "open-access",
  };

  setSession(session);
  return session;
};

export const loginStudent = async (uniqueStudentId: string) => {
  const { data, error } = await supabase
    .from("students")
    .select("id, unique_student_id, first_name, last_name, email")
    .eq("unique_student_id", uniqueStudentId.trim())
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    throw new Error(mapSupabaseError(error));
  }

  if (!data) {
    throw new Error("Student ID not found.");
  }

  const session: AppSession = {
    role: "student",
    userId: data.id,
    uniqueStudentId: data.unique_student_id,
    displayName: formatPersonName(data.first_name, data.last_name) || data.unique_student_id,
    email: data.email,
  };

  setSession(session);
  return session;
};

export const logoutUser = () => {
  clearSession();
};

export const getHomepageStats = async (): Promise<HomepageStats> => {
  const [
    studentsResult,
    healthRecordsResult,
    schoolsResult,
    phcsResult,
  ] = await Promise.all([
    supabase.from("students").select("id", { count: "exact", head: true }),
    supabase.from("health_records").select("id", { count: "exact", head: true }),
    supabase.from("students").select("school_code").not("school_code", "is", null),
    supabase.from("students").select("phc_name").not("phc_name", "is", null),
  ]);

  if (studentsResult.error) throw studentsResult.error;
  if (healthRecordsResult.error) throw new Error(mapSupabaseError(healthRecordsResult.error));
  if (schoolsResult.error) throw new Error(mapSupabaseError(schoolsResult.error));
  if (phcsResult.error) throw new Error(mapSupabaseError(phcsResult.error));

  const totalSchools = new Set(
    (schoolsResult.data ?? []).map((item) => item.school_code).filter(Boolean),
  ).size;
  const totalPHCs = new Set(
    (phcsResult.data ?? []).map((item) => item.phc_name).filter(Boolean),
  ).size;

  return {
    totalStudents: studentsResult.count ?? 0,
    totalSchools,
    totalPHCs,
    totalHealthRecords: healthRecordsResult.count ?? 0,
  };
};

export const getMedicalOfficerDashboardData = async (): Promise<MedicalOfficerDashboardData> => {
  const session = assertSession("medical-officer");

  const [officerResult, studentsResult, recordsResult] = await Promise.all([
    supabase
      .from("medical_officers")
      .select("first_name, last_name")
      .eq("id", session.userId)
      .single(),
    supabase
      .from("students")
      .select("id, unique_student_id, first_name, last_name, roll_number, department, phc_name, created_at, registered_by")
      .eq("registered_by", session.userId)
      .order("created_at", { ascending: false }),
    supabase
      .from("health_records")
      .select("id, consultation_date, follow_up_date, medical_officer_id")
      .eq("medical_officer_id", session.userId),
  ]);

  if (officerResult.error) throw officerResult.error;
  if (studentsResult.error) throw new Error(mapSupabaseError(studentsResult.error));
  if (recordsResult.error) throw new Error(mapSupabaseError(recordsResult.error));

  const today = new Date().toISOString().slice(0, 10);
  const records = recordsResult.data ?? [];
  const todayCount = records.filter((record) => record.consultation_date?.slice(0, 10) === today).length;
  const followUps = records.filter((record) => record.follow_up_date && record.follow_up_date >= today).length;

  return {
    officerName: formatPersonName(officerResult.data?.first_name, officerResult.data?.last_name) || session.displayName,
    stats: [
      { label: "Students Registered", value: String(studentsResult.data?.length ?? 0) },
      { label: "Consultations Logged", value: String(records.length) },
      { label: "Today’s Checkups", value: String(todayCount) },
      { label: "Pending Follow Ups", value: String(followUps) },
    ],
    recentStudents: (studentsResult.data ?? []).slice(0, 8).map((student) => ({
      id: student.id,
      uniqueStudentId: student.unique_student_id,
      fullName: formatPersonName(student.first_name, student.last_name) || student.unique_student_id,
      rollNumber: student.roll_number,
      department: student.department,
      phcName: student.phc_name,
      createdAt: student.created_at,
    })),
  };
};

export const registerStudent = async (input: StudentRegistrationInput) => {
  const session = assertSession("medical-officer");

  const { data, error } = await supabase.rpc("register_student_with_unique_id", {
    p_registered_by: session.userId,
    p_first_name: input.firstName,
    p_last_name: input.lastName,
    p_email: input.email || null,
    p_phone: input.phone || null,
    p_roll_number: input.rollNumber || null,
    p_department: input.department || null,
    p_date_of_birth: input.dateOfBirth || null,
    p_address: input.address || null,
    p_phc_name: input.phcName || null,
    p_phc_code: input.phcCode || null,
    p_school_code: input.schoolCode || null,
    p_district_code: input.districtCode || null,
    p_state_code: input.stateCode || null,
    p_parent_name: input.parentName || null,
    p_parent_phone: input.parentPhone || null,
  });

  if (error) {
    throw new Error(mapSupabaseError(error, "register_student_with_unique_id"));
  }

  if (!data || data.success !== true) {
    throw new Error(data?.message || "Student registration failed.");
  }

  return data.student as { id: string; unique_student_id: string; first_name: string; last_name: string };
};

export const saveHealthRecord = async (input: HealthRecordInput) => {
  const session = assertSession("medical-officer");

  const { data: student, error: studentError } = await supabase
    .from("students")
    .select("id")
    .eq("unique_student_id", input.uniqueStudentId.trim())
    .maybeSingle();

  if (studentError) {
    throw new Error(mapSupabaseError(studentError));
  }

  if (!student) {
    throw new Error("Student ID not found.");
  }

  const { error } = await supabase.from("health_records").insert({
    student_id: student.id,
    medical_officer_id: session.userId,
    consultation_type: input.consultationType || null,
    consultation_date: input.consultationDate,
    symptoms: input.symptoms || null,
    diagnosis: input.diagnosis || null,
    description: input.description || null,
    prescription: input.prescription || null,
    medications: normalizeJsonArray(input.medications),
    lab_tests: normalizeJsonArray(input.labTests),
    notes: input.notes || null,
    follow_up_date: input.followUpDate || null,
    follow_up_notes: input.followUpNotes || null,
  });

  if (error) {
    throw new Error(mapSupabaseError(error));
  }
};

export const searchMedicalOfficerStudents = async (query: string) => {
  const session = assertSession("medical-officer");
  const trimmedQuery = query.trim();

  let request = supabase
    .from("students")
    .select("id, unique_student_id, first_name, last_name, roll_number, department, phc_name, created_at")
    .eq("registered_by", session.userId)
    .order("created_at", { ascending: false })
    .limit(12);

  if (trimmedQuery) {
    request = request.or(
      [
        `unique_student_id.ilike.%${trimmedQuery}%`,
        `first_name.ilike.%${trimmedQuery}%`,
        `last_name.ilike.%${trimmedQuery}%`,
        `roll_number.ilike.%${trimmedQuery}%`,
      ].join(","),
    );
  }

  const { data, error } = await request;

  if (error) {
    throw new Error(mapSupabaseError(error));
  }

  return (data ?? []).map((student) => ({
    id: student.id,
    uniqueStudentId: student.unique_student_id,
    fullName: formatPersonName(student.first_name, student.last_name) || student.unique_student_id,
    rollNumber: student.roll_number,
    department: student.department,
    phcName: student.phc_name,
    createdAt: student.created_at,
  }));
};

export const getStudentDashboardData = async (): Promise<StudentDashboardData> => {
  const session = assertSession("student");
  const lookupId = session.uniqueStudentId || session.displayName;

  const { data: student, error: studentError } = await supabase
    .from("students")
    .select("*")
    .eq("unique_student_id", lookupId)
    .single();

  if (studentError) {
    throw new Error(mapSupabaseError(studentError));
  }

  const { data: healthRecords, error: healthRecordsError } = await supabase
    .from("health_records")
    .select(`
      id,
      consultation_type,
      consultation_date,
      symptoms,
      diagnosis,
      description,
      prescription,
      medications,
      lab_tests,
      notes,
      follow_up_date,
      follow_up_notes,
      medical_officers (
        first_name,
        last_name
      )
    `)
    .eq("student_id", student.id)
    .order("consultation_date", { ascending: false });

  if (healthRecordsError) {
    throw new Error(mapSupabaseError(healthRecordsError));
  }

  return {
    profile: {
      id: student.id,
      uniqueStudentId: student.unique_student_id,
      fullName: formatPersonName(student.first_name, student.last_name),
      email: student.email,
      phone: student.phone,
      rollNumber: student.roll_number,
      department: student.department,
      dateOfBirth: student.date_of_birth,
      address: student.address,
      phcName: student.phc_name,
      phcCode: student.phc_code,
      schoolCode: student.school_code,
      districtCode: student.district_code,
      stateCode: student.state_code,
      parentName: student.parent_name,
      parentPhone: student.parent_phone,
      registeredBy: student.registered_by,
      createdAt: student.created_at,
    },
    records: (healthRecords ?? []).map((record: any) => ({
      id: record.id,
      consultationType: record.consultation_type,
      consultationDate: record.consultation_date,
      symptoms: record.symptoms,
      diagnosis: record.diagnosis,
      description: record.description,
      prescription: record.prescription,
      medications: record.medications,
      labTests: record.lab_tests,
      notes: record.notes,
      followUpDate: record.follow_up_date,
      followUpNotes: record.follow_up_notes,
      medicalOfficerName: formatPersonName(
        record.medical_officers?.first_name,
        record.medical_officers?.last_name,
      ) || "Medical Officer",
    })),
  };
};

export const getAdminDashboardData = async (): Promise<AdminDashboardData> => {
  const session = assertSession("admin");

  const [adminResult, studentsResult, medicalOfficersResult, healthRecordsResult, reportsResult] = await Promise.all([
    supabase.from("admins").select("first_name, last_name").eq("id", session.userId).single(),
    supabase.from("students").select("id, phc_name", { count: "exact" }),
    supabase.from("medical_officers").select("id", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("health_records").select("id, consultation_type, consultation_date", { count: "exact" }),
    supabase.from("reports").select("id, title, report_type, status, created_at").order("created_at", { ascending: false }).limit(6),
  ]);

  if (adminResult.error) throw new Error(mapSupabaseError(adminResult.error));
  if (studentsResult.error) throw new Error(mapSupabaseError(studentsResult.error));
  if (medicalOfficersResult.error) throw new Error(mapSupabaseError(medicalOfficersResult.error));
  if (healthRecordsResult.error) throw new Error(mapSupabaseError(healthRecordsResult.error));
  if (reportsResult.error) throw new Error(mapSupabaseError(reportsResult.error));

  const currentMonth = new Date().toISOString().slice(0, 7);
  const healthRecords = healthRecordsResult.data ?? [];
  const thisMonthCount = healthRecords.filter((record) => record.consultation_date?.slice(0, 7) === currentMonth).length;

  const consultationTypeMap = new Map<string, number>();
  for (const record of healthRecords) {
    const key = record.consultation_type || "General";
    consultationTypeMap.set(key, (consultationTypeMap.get(key) ?? 0) + 1);
  }

  const phcMap = new Map<string, number>();
  for (const student of studentsResult.data ?? []) {
    const key = student.phc_name || "Unassigned PHC";
    phcMap.set(key, (phcMap.get(key) ?? 0) + 1);
  }

  return {
    adminName: formatPersonName(adminResult.data?.first_name, adminResult.data?.last_name) || session.displayName,
    stats: [
      { label: "Total Students", value: String(studentsResult.count ?? 0) },
      { label: "Medical Officers", value: String(medicalOfficersResult.count ?? 0) },
      { label: "This Month’s Consultations", value: String(thisMonthCount) },
      { label: "Total Health Records", value: String(healthRecordsResult.count ?? 0) },
    ],
    consultationTypes: [...consultationTypeMap.entries()]
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6),
    topPhcs: [...phcMap.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6),
    latestReports: (reportsResult.data ?? []).map((report) => ({
      id: report.id,
      title: report.title,
      reportType: report.report_type,
      status: report.status,
      createdAt: report.created_at,
    })),
  };
};
