'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Target, 
  Activity, 
  LogOut,
  Edit3,
  Save,
  Loader2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import { useAuthStore } from '@/store/authStore';
import { useProfileStore } from '@/store/profileStore';
import { ProfileUpdateData } from '@/types';
import { toast } from '@/store/toastStore';

export default function ProfilePage() {
  const router = useRouter();
  const { user, signOut } = useAuthStore();
  const { profile, loading, updateProfile, ensureProfile } = useProfileStore();
  
  const [editMode, setEditMode] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // 편집 중인 데이터
  const [formData, setFormData] = useState<ProfileUpdateData>({
    full_name: '',
    target_calories: 2000,
    height: 0,
    weight: 0,
    activity_level: 'moderate',
  });

  // 프로필 데이터 로드
  useEffect(() => {
    if (user) {
      ensureProfile(user.id, user.email!, user.user_metadata?.name);
    }
  }, [user, ensureProfile]);

  // 프로필 데이터가 로드되면 폼 데이터 초기화
  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        target_calories: profile.target_calories || 2000,
        height: profile.height || 0,
        weight: profile.weight || 0,
        activity_level: profile.activity_level || 'moderate',
      });
    }
  }, [profile]);

  const handleSave = async () => {
    if (!user || !profile) return;

    setSaving(true);
    try {
      const success = await updateProfile(user.id, formData);
      
      if (success) {
        toast.success('프로필이 성공적으로 업데이트되었습니다!');
        setEditMode(false);
      } else {
        toast.error('프로필 업데이트에 실패했습니다.');
      }
    } catch (error) {
      console.error('프로필 저장 오류:', error);
      toast.error('프로필 저장 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        target_calories: profile.target_calories || 2000,
        height: profile.height || 0,
        weight: profile.weight || 0,
        activity_level: profile.activity_level || 'moderate',
      });
    }
    setEditMode(false);
  };

  const handleLogout = () => {
    signOut();
    router.push('/');
  };

  const activityLevels = [
    { value: 'sedentary', label: '좌식 생활', description: '거의 운동하지 않음' },
    { value: 'light', label: '가벼운 활동', description: '주 1-3회 가벼운 운동' },
    { value: 'moderate', label: '보통 활동', description: '주 3-5회 적당한 운동' },
    { value: 'active', label: '활발한 활동', description: '주 6-7회 격한 운동' },
    { value: 'very_active', label: '매우 활발함', description: '매일 격한 운동 또는 육체적 직업' },
  ];

  // BMI 계산
  const calculateBMI = () => {
    if (!profile?.height || !profile?.weight) return { bmi: '0.0', status: '정보 없음', color: 'text-gray-400' };
    
    const heightInM = profile.height / 100;
    const bmi = (profile.weight / Math.pow(heightInM, 2)).toFixed(1);
    
    const bmiNum = parseFloat(bmi);
    if (bmiNum < 18.5) return { bmi, status: '저체중', color: 'text-blue-400' };
    if (bmiNum < 25) return { bmi, status: '정상', color: 'text-green-400' };
    if (bmiNum < 30) return { bmi, status: '과체중', color: 'text-yellow-400' };
    return { bmi, status: '비만', color: 'text-red-400' };
  };

  const bmiInfo = calculateBMI();

  // 로딩 중이면 로딩 표시
  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center min-h-[50vh]">
        <div className="flex items-center space-x-3">
          <Loader2 className="w-6 h-6 animate-spin text-white" />
          <span className="text-white">프로필을 불러오는 중...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* 배경 장식 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-32 h-32 bg-warm-beige/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-40 left-10 w-24 h-24 bg-bright-yellow/20 rounded-full blur-2xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 space-y-6">
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center space-x-4">
            <Button
              variant="glass"
              size="sm"
              onClick={() => router.push('/dashboard')}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-white">프로필</h1>
              <p className="text-white/70">개인 정보 및 설정</p>
            </div>
          </div>

          <div className="flex space-x-2">
            {editMode ? (
              <>
                <Button
                  variant="glass"
                  size="sm"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  취소
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      저장 중...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      저장
                    </>
                  )}
                </Button>
              </>
            ) : (
              <Button
                variant="glass"
                size="sm"
                onClick={() => setEditMode(true)}
              >
                <Edit3 className="w-4 h-4 mr-2" />
                편집
              </Button>
            )}
          </div>
        </motion.div>

        {/* 프로필 카드 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card glassEffect="medium" className="p-6">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-gradient-to-br from-pink/30 to-lavender/30 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
              
              <div className="flex-1 space-y-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-white/70 text-sm mb-2">이름</label>
                    {editMode ? (
                      <Input
                        value={formData.full_name || ''}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                        placeholder="이름을 입력하세요"
                      />
                    ) : (
                      <p className="text-white font-medium">
                        {profile?.full_name || '이름 없음'}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-white/70 text-sm mb-2">이메일</label>
                    <p className="text-white/80 flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      {profile?.email || user?.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* 신체 정보 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card glassEffect="medium" className="p-6">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              신체 정보
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-white/70 text-sm mb-2">키 (cm)</label>
                {editMode ? (
                  <Input
                    type="number"
                    value={formData.height || ''}
                    onChange={(e) => setFormData({ ...formData, height: parseFloat(e.target.value) || 0 })}
                    placeholder="키를 입력하세요"
                  />
                ) : (
                  <p className="text-white font-medium">
                    {profile?.height ? `${profile.height} cm` : '정보 없음'}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-white/70 text-sm mb-2">몸무게 (kg)</label>
                {editMode ? (
                  <Input
                    type="number"
                    value={formData.weight || ''}
                    onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) || 0 })}
                    placeholder="몸무게를 입력하세요"
                  />
                ) : (
                  <p className="text-white font-medium">
                    {profile?.weight ? `${profile.weight} kg` : '정보 없음'}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-white/70 text-sm mb-2">BMI</label>
                <div className="flex items-center space-x-2">
                  <p className="text-white font-medium">{bmiInfo.bmi}</p>
                  <span className={`text-sm ${bmiInfo.color}`}>({bmiInfo.status})</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* 목표 설정 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card glassEffect="medium" className="p-6">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Target className="w-5 h-5 mr-2" />
              목표 설정
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-white/70 text-sm mb-2">하루 목표 칼로리</label>
                {editMode ? (
                  <Input
                    type="number"
                    value={formData.target_calories || ''}
                    onChange={(e) => setFormData({ ...formData, target_calories: parseInt(e.target.value) || 0 })}
                    placeholder="목표 칼로리를 입력하세요"
                  />
                ) : (
                  <p className="text-white font-medium">
                    {profile?.target_calories || 2000} kcal
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-white/70 text-sm mb-2">활동 수준</label>
                {editMode ? (
                  <div className="space-y-2">
                    {activityLevels.map((level) => (
                      <label key={level.value} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          value={level.value}
                          checked={formData.activity_level === level.value}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            activity_level: e.target.value as 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
                          })}
                          className="text-bright-yellow"
                        />
                        <div>
                          <p className="text-white font-medium">{level.label}</p>
                          <p className="text-white/60 text-sm">{level.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div>
                    <p className="text-white font-medium">
                      {activityLevels.find(l => l.value === profile?.activity_level)?.label || '보통 활동'}
                    </p>
                    <p className="text-white/60 text-sm">
                      {activityLevels.find(l => l.value === profile?.activity_level)?.description || '주 3-5회 적당한 운동'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* 로그아웃 버튼 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card glassEffect="medium" className="p-6">
            <button 
              onClick={() => setShowLogoutModal(true)}
              className="w-full flex items-center justify-between p-4 hover:bg-red-500/10 rounded-lg transition-colors group"
            >
              <div className="flex items-center space-x-3">
                <LogOut className="w-5 h-5 text-red-400" />
                <div className="text-left">
                  <p className="text-red-400 font-medium">로그아웃</p>
                  <p className="text-white/60 text-sm">계정에서 로그아웃합니다</p>
                </div>
              </div>
              <ArrowLeft className="w-4 h-4 text-red-400 rotate-180" />
            </button>
          </Card>
        </motion.div>
      </div>

      {/* 로그아웃 확인 모달 */}
      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="로그아웃"
        maxWidth="sm"
      >
        <div className="text-center space-y-4">
          <p className="text-white/80">정말 로그아웃하시겠습니까?</p>
          
          <div className="flex space-x-3">
            <Button
              variant="glass"
              onClick={() => setShowLogoutModal(false)}
              className="flex-1"
            >
              취소
            </Button>
            <Button
              variant="primary"
              onClick={handleLogout}
              className="flex-1 bg-red-500 hover:bg-red-600"
            >
              로그아웃
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}